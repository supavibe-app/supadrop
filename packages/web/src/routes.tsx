import { BrowserRouter, Route, Switch } from 'react-router-dom';
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
import ClaimPage from './views/claim';

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
              path="/auction/create/:step_param?"
              component={() => <AuctionCreateView />}
            />
            <Route
              exact
              path="/auction/:id/billing"
              component={() => <BillingView />}
            />

            {/* Updated Path */}
            <Route exact path="/claim/:id" component={() => <ClaimPage />} />
            <Route exact path="/auction/:id" component={() => <AuctionView />} />
            <Route path="/auction" component={() => <AuctionListView />} />
            <Route path="/activity" component={() => <ActivityView />} />
            <Route exact path="/" component={() => <Home />} />
          </Switch>
        </Providers>
      </BrowserRouter>
    </>
  );
}
