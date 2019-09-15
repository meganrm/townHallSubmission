import React from 'react';
import { notification, Button, Drawer, Icon, Card } from 'antd';

class DupeDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };
    this.showDrawer = this.showDrawer.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { dupes } = this.props;

    if (dupes.length && !prevProps.dupes.length){
      notification.warning({
        message: 'Possible duplicate event',
        duration: null,
        key: 'dupe',
        btn: <Button type="primary" onClick={this.showDrawer}>
            Show possible duplicates
            </Button>,
        description: 'This event might have already been submitted, click to see full details:',
        icon: <Icon type="alert" style={{ color: '#108ee9' }} />,
      });
    }
  }


  showDrawer() {
    notification.close("dupe")
    
    this.setState({
      visible: true,
    });
  }

  onClose() {
    this.setState({
      visible: false,
    });
  }

  render() {
    const { dupes } = this.props;
    if (!dupes.length) {
      return null;
    }
    return (
      <div>

        <Drawer
          title="Possible Duplicate Event(s)"
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
          width={550}
        >
          {dupes.map(dupe => (

            <Card
            >
              <Card.Meta
                title={`${dupe.displayName} ${dupe.state} ${dupe.district || ''}`}
                description={dupe.meetingType}
              />
              <ul>
                <li>
                  Location: {dupe.Location}
                </li>
                <li>
                  Address: {dupe.address}
                </li>
                <li>
                  Time: {dupe.Time}
                </li>
                <li>
                  Date: {dupe.dateString}
                </li>
              </ul>
            </Card>) )}
        </Drawer>
      </div>
    );
  }
}

export default DupeDrawer;
