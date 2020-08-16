import React from "react";
import Entry from "./entry";
import emojipedia from "../emojipedia";

function card(item) {
  return (
    <Entry
      key={item.id}
      emoji={item.emoji}
      title={item.name}
      about={item.meaning}
    />
  );
}

function App() {
  return (
    <div>
      <h1>
        <span>emojipedia</span>
      </h1>

      <dl className="dictionary">{emojipedia.map(card)}</dl>
    </div>
  );
}

export default App;
