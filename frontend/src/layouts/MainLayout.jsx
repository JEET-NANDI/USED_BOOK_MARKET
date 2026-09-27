import Navbar from "../components/Navbar";

function MainLayout({ children }) {
  return (
    <>
      <Navbar />

      <main className="main-content">
        {children}
      </main>
    </>
  );
}

export default MainLayout;