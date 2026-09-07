import TrendingBlogs from "./TrendingBlogs";
import WhoToFollow from "./WhoToFollow";
import "./RightSidebar.css"

export default function RightSidebar() {
  return (
    <div style={{
        width: "250px",
        borderLeft: "1px solid #eee",
        padding: "20px",
      }}
      className="RightSidebar "
    >

      <TrendingBlogs />
      <WhoToFollow />
    </div>
  );
}
