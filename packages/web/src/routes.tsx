import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useParams } from 'react-router';
import Home from './components/Home';
import { Providers } from './providers';
import {
  AnalyticsView,
  ArtCreateView,
  ArtistsView,
  ArtistView,
  ArtView,
  ArtworksView,
  AuctionCreateView,
  AuctionView,
} from './views';
import { AdminView } from './views/admin';
import { BillingView } from './views/auction/billing';
import ActivityView from './views/activity';
import AuctionListView from './views/auctionList';
import Profile from './views/profile';
import MarketComponent from './views/market';

const DirectPath = () => {
  const { path } = useParams<{ path: string }>();
  const paths = ['auction', 'activity', 'market'];
  const visitedPath = paths.indexOf(path);

  switch (visitedPath) {
    case 0:
      return <AuctionListView />

    case 1:
      return <ActivityView />

    case 2:
      return <MarketComponent />

    default:
      return <Profile userId={path} />
  }
};

export function Routes() {
  return (
    <>
      <BrowserRouter basename={'/'}>
        <Providers>
          <Switch>
            <Route exact path="/admin" component={() => <AdminView />} />
            <Route
              exact
              path="/analytics"
              component={() => <AnalyticsView />}
            />
            <Route
              exact
              path="/art/create/:step_param?"
              component={() => <ArtCreateView />}
            />
            <Route
              exact
              path="/artworks/:id?"
              component={() => <ArtworksView />}
            />
            <Route exact path="/art/:id" component={() => <ArtView />} />
            <Route exact path="/artists/:id" component={() => <ArtistView />} />
            <Route exact path="/artists" component={() => <ArtistsView />} />

            <Route
              exact
              path="/auction/:id/billing"
              component={() => <BillingView />}
            />

            <Route exact path="/list/create" component={() => <AuctionCreateView />} />

            {/* Updated Path */}
            <Route exact path="/" component={() => <Home />} />
            <Route exact path="/:path" component={DirectPath} />

            <Route path="/auction/:id" component={() => <AuctionView />} />
          </Switch>
        </Providers>
      </BrowserRouter>
    </>
  );
}
