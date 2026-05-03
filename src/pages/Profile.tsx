import Layout from "../components/Layout";

const Profile = () => {
  const cards = [
    { title: "Name", value: "EduNova Learner" },
    { title: "Plan", value: "Premium" },
    { title: "Current Streak", value: "5 days" },
    { title: "Coins Earned", value: "420" },
  ];

  return (
    <Layout>
      <div className="page-header">
        <h1>Profile</h1>
        <p>Manage your account and track premium learner status.</p>
      </div>
      <section className="dashboard-grid">
        {cards.map((item) => (
          <article key={item.title} className="premium-card">
            <p className="card-label">{item.title}</p>
            <h3>{item.value}</h3>
          </article>
        ))}
      </section>
    </Layout>
  );
};

export default Profile;