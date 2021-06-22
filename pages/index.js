import styles from '../styles/Home.module.css'
import PageBase from './pageBase';
import NewBook from '../components/newBook'

/* Components */
import SearchBar from '../components/searchBar'
import { FloatingButton } from '../components/ui/button'
import Footer from '../components/footer'
import CardListWrapper from '../components/cards/cardListWrapper';
import LibraryCard from '../components/cards/libraryCard';

/* Other Imports */
import Fuse from 'fuse.js'
import { useState, useEffect } from 'react'
import { AnimatePresence, AnimateSharedLayout } from 'framer-motion'
import { parse } from 'cookie'
import { getUserInfo, withUserId } from '../lib/db'


export async function getServerSideProps(context) {
  const cookie_header = context.req.headers.cookie;
  if (!cookie_header) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    }
  }

  const cookies = parse(context.req.headers.cookie);
  const token = cookies.token;
  const info = await withUserId(token, async (user_id) => await getUserInfo(user_id));
  if (info == null) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    }
  }

  return {
    props: {
      user_info: info,
    },
  };
}

export default function Home({ user_info }) {
  const [newBookPanel, setNewBookPanel] = useState(false);
  const [data, setData] = useState([]);

  const [query, setQuery] = useState('');

  const fuse = new Fuse(data, {
    keys: [
      'title',
    ],
  });

  const fuseResults = fuse.search(query);
  const bookResults = query ? fuseResults.map(result => result.item) : data;

  function onSearch({ currentTarget }) {
    setQuery(currentTarget.value);
  }

  const exportData = () => {
    throw {
      message: "Unimplemented"
    }
    /*var element = document.createElement('a');
    element.style.display = 'none';
    element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data)));
    element.setAttribute('download', 'data.json');
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);*/
  }

  const importData = (target) => {
    throw {
      message: "Unimplemented"
    }
    /*const reader = new FileReader();
    reader.addEventListener('load', ({ target }) => {
      setData(JSON.parse(atob(target.result.replace("data:application/json;base64,", ""))));
    });
    reader.readAsDataURL(target);*/
  }

  async function updateData() {
    console.log("Updating data");
    const response = await fetch("/api/me/get_book_infos");
    const json = await response.json();
    if (json.status != "OK") {
      throw json;
    }
    const infos = json.info;
    setData(infos)
  }

  useEffect(updateData, [])


  return (
    <PageBase>
      <SearchBar onInput={onSearch} query={query} />
      <div style={{
        padding: "5rem 0",
        minHeight: "100vh",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <AnimateSharedLayout>
          <CardListWrapper
            data={data}
          >
            {bookResults.map(entry => (
              <LibraryCard
                key={entry.book_id}
                entry={entry}
                onDelete={() => updateData()}
              />
            ))}
          </CardListWrapper>
        </AnimateSharedLayout>
      </div>
      <Footer
        data={data}
        showModButtons={user_info.moderation_level >= 2}
        onExportDataClick={exportData}
        onImportDataClick={() => {
          var element = document.getElementById('importData');
          element.click();
        }}
      />
      <input id="importData" style={{ display: 'none' }} type="file" accept=".json" onChange={({ target }) => { importData(target.files[0]); target.value = null }} />
      <AnimatePresence>
        {newBookPanel && (
          <NewBook
            onAddClicked={() => updateData()}
            onOutsideClicked={() => setNewBookPanel(false)}
          />
        )}
      </AnimatePresence>
      <FloatingButton hoverTitle="Add New Book" icon="fas fa-plus" onClick={() => setNewBookPanel(!newBookPanel)} />

      {/* <QuickAlert message="A New Book Has Been Added!" icon="fas fa-check" /> */}

    </PageBase>
  );
}
