import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProfilePage.css";

import { getUserProfile } from "../../Services/AuthService";

import ProfileHeader from "../../Components/Profile/ProfileHeader";
import BlogCard from "../../Components/Blog/BlogCard";
import ErrorState from "../../Components/Common/ErrorState/ErrorState";

export default function ProfilePage() {
  const { id } = useParams();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getUserProfile(id);

      setProfile(res.data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Couldn't load this profile. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [id]);

  if (loading) {
    return <div className="profile-loading">
      <div className="stry-spinner" />
      <p>Loading profile…</p>
      </div>;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={fetchProfile}
        showHomeButton={true}
      />
    );
  }

  if (!profile) return null;

  const { user, isOwnProfile, followState, blogs } = profile;

  return (
    <div className="profile-page">
      <ProfileHeader
        user={user}
        isOwnProfile={isOwnProfile}
        followState={followState}
      />

      <div className="profile-blogs">
        <h3 className="profile-blogs-heading">
          {isOwnProfile ? "Your stories" : `Stories by ${user.name}`}
        </h3>

        {blogs.length === 0 ? (
          <p className="profile-blogs-empty">
            {isOwnProfile
              ? "You haven't published anything yet."
              : "No stories published yet."}
          </p>
        ) : (
          <div className="profile-blogs-list">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

