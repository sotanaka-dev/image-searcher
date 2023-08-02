import styles from "../styles/components/PostList.module.scss";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { serviceIcons, MdHelpOutline } from "../components/Icon";

export default function SearchResult({ posts, selectPost }) {
  function setIcon(service_name) {
    return serviceIcons[service_name] || MdHelpOutline;
  }

  return (
    <ResponsiveMasonry columnsCountBreakPoints={{ 768: 4, 0: 2 }}>
      <Masonry gutter="12px">
        {posts.map((post) => {
          const Icon = setIcon(post.service_name);
          return (
            <div className={styles.wrap} key={post.id}>
              <Icon className={styles.icon} />
              <img
                className={styles.image}
                src={post.image}
                alt={post.title}
                onClick={() => selectPost(post)}
              />
            </div>
          );
        })}
      </Masonry>
    </ResponsiveMasonry>
  );
}
