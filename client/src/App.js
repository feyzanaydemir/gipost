import Header from './components/Header';
import Profile from './components/Profile';
import Search from './components/Search';
import People from './components/People';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Feed from './components/Feed';
import Nav from './components/Nav';
import Settings from './components/Settings';
import Err from './components/Err';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import './assets/styles/reset.css';
import './assets/styles/App.css';
import { useContext } from 'react';
import { Context } from './context/Context';

function App() {
  const { user } = useContext(Context);

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {user ? (
            <>
              <Header />
              <div className="container">
                <Feed />
                <div className="nav-container">
                  <Nav />
                </div>
              </div>
            </>
          ) : (
            <SignIn />
          )}
        </Route>
        <Route exact path="/signin">
          {user ? <Redirect to="/" /> : <SignIn />}
        </Route>
        <Route exact path="/signup">
          {user ? <Redirect to="/" /> : <SignUp />}
        </Route>
        <Route exact path="/search/:searchword">
          <Header />
          <div className="container">
            <Search />
            <div className="nav-container">
              <Nav />
            </div>
          </div>
        </Route>
        <Route exact path="/u/:username">
          <Header />
          <div className="container ">
            <Profile />
            <div className="nav-container">
              <Nav />
            </div>
          </div>
        </Route>
        <Route exact path="/u/:username/people">
          <Header />
          <div className="container">
            <People />
            <div className="nav-container">
              <Nav />
            </div>
          </div>
        </Route>
        <Route exact path="/u/:username/settings">
          <Header />
          <div className="container">
            <Settings />
            <div className="nav-container">
              <Nav />
            </div>
          </div>
        </Route>
        <Route exact path="/u/:username/:saved">
          <Header />
          <div className="container">
            <Feed />
            <div className="nav-container">
              <Nav />
            </div>
          </div>
        </Route>
        <Route path="*">
          {user ? (
            <>
              <Header />
              <div className="container">
                <Err />
                <div className="nav-container">
                  <Nav />
                </div>
              </div>
            </>
          ) : (
            <Redirect to="/" />
          )}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
