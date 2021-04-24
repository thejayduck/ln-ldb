import Head from 'next/head'
import styles from '../styles/Home.module.css'
import NewBook from './newBook'
import jikanjs from 'jikanjs'

const data = [...Array(1).keys()].map(n => ({
  title: "Pretty Boy Detective",
  coverUrl: "https://i.ibb.co/2dcp1RR/CQO6-Nvu-Uc-AAz-Q1-Y.jpg",
  chapter: 25,
  volume: 1,
  status: "Reading", //Reading, Paused, Dropped, Planning
}))

jikanjs.search("manga", "gamer").then(({ results }) => {
  results.forEach(ln => {
    data.push({
      title: ln.title,
      coverUrl: ln.image_url,
      chapter: 0,
      volume: 0,
      status: "Reading",
    });
  });
});

function NovelCard({ entry }) {
  return (
    <div className={styles.activityEntry}>
      <div className={styles.wrap}>
        <div className={styles.list}>
          <p title={entry.title} className={styles.title}>{entry.title}</p>
          <img className={styles.cover} src={entry.coverUrl} />
          <div className={styles.details}>
            <div>
              <span className={styles.status}>Current Chapter: {entry.chapter}</span>
              <hr />
              {/* <span className={styles.status}>Current Volume: {entry.volume}</span>
              <hr/>
              <span className={styles.status}>Status: {entry.status}</span>
              <hr/> */}
              <a title="Increase Progress" className={`${styles.icon} fas fa-plus ${styles.faPlus}`}></a>
              <a title="Decrease Progress" className={`${styles.icon} fas fa-minus ${styles.faMinus}`}></a>
              <a title="Info" className={`${styles.icon} fas fa-info ${styles.faInfo}`}></a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Book Library</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css" />
        <meta name="mobile-web-app-capable" content="yes" />

        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="public/favicon.ico" />

      </Head>

      <main className={styles.main}>
        <div className={styles.searchContainer}>
          <form action="/" className={styles.searchBar}>
            <i className={`${styles.icon} fas fa-search ${styles.faSearch}`} />
            <input type="text" placeholder="Search..." name="search" maxLength="50" />
          </form>
        </div>
        <div className={styles.activityContainer}>
          <div className={styles.activityFeed}>
            {data.map(entry => (<NovelCard entry={entry} />))}
          </div>
        </div>
      </main>
      <a title="Add New Book" className={`${styles.newBook} fas fa-plus ${styles.faPlus}`} href="/" />
      <footer className={styles.footer}>
        <p>Finished Books: x</p>
        <br />
        <p>Total Pages Read: x</p>
        <br />
        <a title="Check Out My Github" href="https://github.com/thejayduck" className="fab fa-github" target="_blank" />
      </footer>
      {/* <NewBook/> */}
    </div>
  )
}
