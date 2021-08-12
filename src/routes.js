import React, { Component } from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";

import Header from "./components/header";
import Footer from "./components/footer";

import Home from "./components/home";
import Login from "./components/login";
import Contact from "./components/contact";

import ToastComponent from "./utils/toasts";
class Routes extends Component {
  render() {
    return (
      <BrowserRouter>
        <Header />
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/contact" component={Contact} />
          <Route path="/" component={Home} />
        </Switch>
        <Footer />
        <ToastComponent />
      </BrowserRouter>
    );
  }
}

export default Routes;
