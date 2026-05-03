import Layout from "../components/Layout";

const Progress = () => {
  return (
    <Layout>
      <div className="page-header">
        <h1>Progress</h1>
        <p>Your latest performance across subjects.</p>
      </div>
      <div className="premium-card">
        <p>📘 Math: 80%</p>
        <p>📗 Science: 70%</p>
        <p>📕 English: 90%</p>
      </div>
    </Layout>
  );
};

export default Progress;