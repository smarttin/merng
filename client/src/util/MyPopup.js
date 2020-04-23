import React from "react";
import { Popup } from "semantic-ui-react";

export default function MyPopup(props) {
  return <Popup inverted content={props.content} trigger={props.children} />;
}
