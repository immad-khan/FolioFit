import { useRoute } from "./lib/router";
import { currentUser } from "./lib/auth";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import SkillBotPage from "./pages/SkillBotPage";
import JobScraperPage from "./pages/JobScraperPage";
import QuizMakerPage from "./pages/QuizMakerPage";
import InterviewPage from "./pages/InterviewPage";
import PortfolioPage from "./portfolio/PortfolioPage";
import { Header } from "./pages/Landing";

export default function App() {
  const route = useRoute();
  let page = <Landing />;
  switch (route) {
    case "/login":
      page = <Login />;
      break;
    case "/signup":
      page = <Signup />;
      break;
    case "/dashboard":
      page = currentUser() ? <Dashboard /> : <Login />;
      break;
    case "/skillbot":
      page = <SkillBotPage />;
      break;
    case "/scraper":
      page = <JobScraperPage />;
      break;
    case "/quiz":
      page = <QuizMakerPage />;
      break;
    case "/interview":
      page = <InterviewPage />;
      break;
    case "/portfolio":
      page = <PortfolioPage />;
      break;
  }

  const pageClass = route === "/" ? "" : `app-page app-page--${route.slice(1)}`;
  const topPadding = route === "/" || route === "/dashboard" ? "" : "pt-20";
  return (
    <>
      <Header />
      <div className={`${topPadding} ${pageClass}`}>{page}</div>
    </>
  );
}
