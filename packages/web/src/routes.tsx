import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Router, useParams } from 'react-router';
import { createBrowserHistory } from 'history';
import ReactGA from 'react-ga';

import { Providers } from './providers';
import {
  ArtCreateView,
  ArtView,
  AuctionCreateView,
  AuctionView,
  BillingView,
} from './views';
import ActivityView from './views/activity';
import AuctionListView from './views/auctionList';
import Profile from './views/profile';
import MarketComponent from './views/market';
import LandingPage from './views/landingPage';
import About from './views/about';
import { SellView } from './views/sellPage';

const DirectPath = () => {
  const { path } = useParams<{ path: string }>();
  const paths = ['auction', 'activity', 'market', 'about', 'create', 'sell'];
  const visitedPath = paths.indexOf(path);

  switch (visitedPath) {
    case 0:
      return <AuctionListView />;
    case 1:
      return <ActivityView />;
    case 2:
      return <MarketComponent />;
    case 3:
      return <About />;
    case 4:
      return <ArtCreateView />;
    case 5:
      return <SellView />;
    default:
      return <Profile userId={path} />;
  }
};

const history = createBrowserHistory();

export function Routes() {
  // ReactGA.initialize('UA-212819386-1', {
  //   debug: false,
  //   standardImplementation: true,
  // });

  history.listen(location => {
    // ReactGA.set({ page: location.pathname }); // Update the user's current page
    ReactGA.pageview(location.pathname); // Record a pageview for the given page
  });

  return (
    <Router history={history}>
      <Switch>
        <Providers>
          {/* <Route exact path="/admin" component={() => <AdminView />} />
            <Route exact path="/analytics" component={() => <AnalyticsView />} />
            <Route exact path="/artworks/:id?" component={() => <ArtworksView />} />
            <Route exact path="/artists/:id" component={() => <ArtistView />} />
            <Route exact path="/artists" component={() => <ArtistsView />} />
            */}
          {/* Updated Path */}
          <Route exact path="/" component={() => <LandingPage />} />
          <Route exact path="/:path" component={DirectPath} />
          <Route exact path="/auction/:id" component={() => <AuctionView />} />
          <Route
            exact
            path="/auction/:id/settle"
            component={() => <BillingView />}
          />
          <Route
            exact
            path="/list/create"
            component={() => <AuctionCreateView />}
          />
          <Route exact path="/art/:id" component={() => <ArtView />} />
        </Providers>
      </Switch>
    </Router>
  );
}
