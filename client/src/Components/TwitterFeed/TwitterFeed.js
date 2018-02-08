import React, { Component } from 'react';
import { Timeline } from 'react-twitter-widgets';

class TwitterFeed extends Component {
  render() {
    return (
      <div className="card card-section" >
        <div className="card-body">
          <Timeline
            dataSource={{
              sourceType: 'profile',
              screenName: 'coindesk',
            }}
            options={{
              username: 'coindesk',
              height: '767',
            }}
            onLoad={() => console.log('Timeline is loaded!')}
          />
        </div>
      </div>
    );
  }
}

export default TwitterFeed;

