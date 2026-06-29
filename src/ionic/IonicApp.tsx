"use client";

import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { flame, ribbon, time } from "ionicons/icons";

import Feed from "./Feed";
import StoryDetail from "./StoryDetail";

/* Core Ionic styles */
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
/* Optional utility styles */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
/* Auto light/dark following the OS appearance */
import "@ionic/react/css/palettes/dark.system.css";
/* App-specific Ionic tweaks */
import "./ionic.css";

// Force iOS mode on every platform so the look is consistent.
setupIonicReact({ mode: "ios" });

export default function IonicApp() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/" render={() => <Feed feed="top" title="Top" />} />
            <Route
              exact
              path="/best"
              render={() => <Feed feed="best" title="Best" />}
            />
            <Route
              exact
              path="/newest"
              render={() => <Feed feed="newest" title="New" />}
            />
            {/* Detail is matched last so it doesn't shadow the feed routes. */}
            <Route exact path="/:id" component={StoryDetail} />
            <Route render={() => <Redirect to="/" />} />
          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            <IonTabButton tab="top" href="/">
              <IonIcon icon={flame} aria-hidden="true" />
              <IonLabel>Top</IonLabel>
            </IonTabButton>
            <IonTabButton tab="best" href="/best">
              <IonIcon icon={ribbon} aria-hidden="true" />
              <IonLabel>Best</IonLabel>
            </IonTabButton>
            <IonTabButton tab="newest" href="/newest">
              <IonIcon icon={time} aria-hidden="true" />
              <IonLabel>New</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
}
