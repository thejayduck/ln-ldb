import Head from 'next/head'
import styles from '../styles/newPage.module.css'

const data = [...Array(5).keys()].map(n => ({
  title: "Pretty Boy Detective",
  url: "https://i.ibb.co/2dcp1RR/CQO6-Nvu-Uc-AAz-Q1-Y.jpg",
  chapter: 25,
  volume: 1,
}))

function NovelCard({entry}) {
  return (
    <div className={styles.activityEntry}>
      <div className={styles.wrap}>
        <div className={styles.list}>
          <img className={styles.cover} src={entry.url}/>
          <div className={styles.details}>
            <p className={styles.title}>{entry.title}</p>
            <div>
              <span className={styles.status}>Current Chapter: {entry.chapter}</span>
              <br/>
              <span className={styles.status}>Current Volume: {entry.volume}</span>
            </div>

          </div>
          <div className={styles.progress}>
            <a className={`${styles.icon} fas fa-plus ${styles.faPlus}`}></a>
            <a className={`${styles.icon} fas fa-minus ${styles.faMinus}`}></a>
            <a className={`${styles.icon} fas fa-info ${styles.faInfo}`}></a>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function NewPage() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Book Library</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css" />
        <meta name="mobile-web-app-capable" content="yes"/>
      </Head>
      
      <main className={styles.main}>
        <div className={styles.searchContainer}>
          <form action="/" className={styles.searchBar}>
            <i className={`${styles.icon} fas fa-search ${styles.faSearch}`}/>
            {/* <button type="submit"><i class="fa fa-search"></i></button> */}
            <input type="text" placeholder="Search..." name="search" maxLength="50"/>
          </form>
        </div>
        <div className={styles.activityFeed}>
          
          {data.map(entry => (<NovelCard entry={entry}/>))}
          
        </div>
      </main>
      <a className={`${styles.newBook} fas fa-plus ${styles.faPlus}`} href="/newBook"/>
      <footer className={styles.footer}>
        <p>Finished Books: x</p>
        <br/>
        <p>Total Pages Read: x</p>
      </footer>
    </div>
  )
}
