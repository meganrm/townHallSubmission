import React from 'react';
import { Affix, Button, Drawer } from 'antd';

class DupeDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };
    this.showDrawer = this.showDrawer.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  showDrawer() {
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

        <Button type="primary" onClick={this.showDrawer}>
            Show possible duplicate events
        </Button>
        <Drawer
          title="Possible Duplicate Events"
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
          width={550}
        >
          {dupes.map(dupe => (

            <pre className="language-bash" style={{ overflow: 'visible' }}>

              {JSON.stringify(dupe, null, 2)}
            </pre>) )}
        </Drawer>
      </div>
    );
  }
}

export default DupeDrawer;
