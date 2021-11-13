import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useParams } from 'react-router';
import { createBrowserHistory } from 'history';
import ReactGA from 'react-ga';

import Home from './components/Home';
import { Providers } from './providers';
import {
  ArtCreateView,
  ArtView,
  AuctionCreateView,
  AuctionView,
} from './views';
import ActivityView from './views/activity';
import AuctionListView from './views/auctionList';
import Profile from './views/profile';
import MarketComponent from './views/market';
import LandingPage from './views/landingPage';
import About from './views/about';
import { AppLayout } from './components/Layout';

const DirectPath = () => {
  const { path } = useParams<{ path: string }>();
  const paths = ['auction', 'activity', 'market', 'about'];
  const visitedPath = paths.indexOf(path);

  switch (visitedPath) {
    case 0:
    // return (
    //   <Providers>
    //     <AuctionListView />
    //   </Providers>
    // );
    case 1:
    // return (
    //   <Providers>
    //     <ActivityView />
    //   </Providers>
    // );
    case 2:
    // return (
    //   <Providers>
    //     <MarketComponent />
    //   </Providers>
    // );
    case 3:
      return <About />

    // default:
    //   return (
    //     <Providers>
    //       <Profile userId={path} />
    //     </Providers>
    //   );
  }

  return <div />
};

export function Routes() {
  const history = createBrowserHistory();

  ReactGA.initialize('UA-212819386-1', {
    debug: false,
    standardImplementation: true,
  });

  history.listen(location => {
    // ReactGA.set({ page: location.pathname }); // Update the user's current page
    ReactGA.pageview(location.pathname); // Record a pageview for the given page
  });

  return (
    <BrowserRouter basename={'/'}>
      <AppLayout>
        <Switch>
          <Route exact path="/" component={() => <LandingPage />} />
          <Route exact path="/:path" component={DirectPath} />

          {/* <Providers> */}
          {/* 
            <Route exact path="/admin" component={() => <AdminView />} />
            <Route exact path="/analytics" component={() => <AnalyticsView />} />
            <Route exact path="/artworks/:id?" component={() => <ArtworksView />} />
            <Route exact path="/artists/:id" component={() => <ArtistView />} />
            <Route exact path="/artists" component={() => <ArtistsView />} />
            <Route exact path="/auction/:id/billing" component={() => <BillingView />} />
          */}

          {/* <Route exact path="/art/create/:step_param?" component={() => <ArtCreateView />} /> */}

          {/* Updated Path */}

          {/* <Route path="/art/:id" component={() => <ArtView />} />
            <Route path="/auction/:id" component={() => <AuctionView />} />
            <Route exact path="/list/create" component={() => <AuctionCreateView />} />
          </Providers> */}
        </Switch>
      </AppLayout>
    </BrowserRouter>
  );
}
