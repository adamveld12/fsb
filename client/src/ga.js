import ReactGA from 'react-ga';

ReactGA.initialize(process.env.REACT_APP_GA_TRACKING, {
  debug: process.env.NODE_ENV !== 'production',
  // gaOptions: {
  //   userId: 123
  // }
});

// track a page view
export function pageView(url){
  ReactGA.pageview(url || '/');
}

/*
Track an in page user event:

args.category	String. Required. A top level category for these events. E.g. 'User', 'Navigation', 'App Editing', etc.
args.action	String. Required. A description of the behaviour. E.g. 'Clicked Delete', 'Added a component', 'Deleted account', etc.
args.label	String. Optional. More precise labelling of the related action. E.g. alongside the 'Added a component' action, we could add the name of a component as the label. E.g. 'Survey', 'Heading', 'Button', etc.
args.value	Int. Optional. A means of recording a numerical value against an event. E.g. a rating, a score, etc.
args.nonInteraction	Boolean. Optional. If an event is not triggered by a user interaction, but instead by our code (e.g. on page load, it should be flagged as a nonInteraction event to avoid skewing bounce rate data.
args.transport	String. Optional. This specifies the transport mechanism with which hits will be sent. Valid values include 'beacon', 'xhr', or 'image'.

*/
export function event({ category, action, value, label, nonInteraction, transport }){
  ReactGA.event({
    category,
    action,
    value,
    label,
    nonInteraction,
    transport
  });
}
/*
Measure period of time such as ajax requests and resources loaded
args.category	String. Required. A string for categorizing all user timing variables into logical groups.
args.var	String. Required. Name of the variable being recorded.
args.value	Int. Required. Number of milliseconds elapsed time to report.
args.label	String. Optional. It can improved visibility in user timing reports.
*/
export function time({ category, variable, value, label }){
  ReactGA.timing({
    category,
    variable,
    value,
    label,
  });
}

/*
args.description	String. Optional. Description of what happened.
args.fatal	String. Optional. Set to true if it was a fatal exception.
*/
export function error(description, fatal){
  ReactGA.exception({
    description,
    fatal
  })
}
