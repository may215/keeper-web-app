import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import LeftNav from 'material-ui/lib/left-nav'
import MenuItem from 'material-ui/lib/menus/menu-item'
import Divider from 'material-ui/lib/divider'
import { actions as navigationActions } from 'redux/modules/navigation'
import { actions as labelsActions } from 'redux/modules/labels'

import AccountCircle from 'material-ui/lib/svg-icons/action/account-circle'
import ViewModule from 'material-ui/lib/svg-icons/action/view-module'
import Label from 'material-ui/lib/svg-icons/action/label'
import Delete from 'material-ui/lib/svg-icons/action/delete'
import Settings from 'material-ui/lib/svg-icons/action/settings'
import Add from 'material-ui/lib/svg-icons/content/add'
import Share from 'material-ui/lib/svg-icons/social/share'
import CircularProgress from 'material-ui/lib/circular-progress'
import LinearProgress from 'material-ui/lib/linear-progress'

import styles from './styles.scss'

export class AppNavigation extends React.Component {
  static propTypes = {
    toggleNavigation: PropTypes.func.isRequired,
    fetchLabels: PropTypes.func.isRequired,
    removeFromLabels: PropTypes.func.isRequired,
    restoreFromLabels: PropTypes.func.isRequired,
    discardRestoredLabel: PropTypes.func.isRequired,
    discardRemovedLabel: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    labels: PropTypes.object.isRequired,
    routing: PropTypes.object.isRequired
  };

  componentDidMount () {
    const { fetchLabels } = this.props
    fetchLabels()
  }

  get spinner () {
    const { isFetching, items } = this.props.labels
    if (isFetching) {
      if (items.length) {
        return (
          <LinearProgress mode='indeterminate'/>
        )
      } else {
        return (
          <CircularProgress />
        )
      }
    }
  }

  get labels () {
    const { labels, toggleNavigation } = this.props
    const items = this.props.labels.items.map(
      (label) => <Link
        key={`label-${label.id}`}
        to={{pathname: `/label/${label.id}`}}
        onTouchTap={() => toggleNavigation(false)}
        >
        <MenuItem primaryText={label.label} leftIcon={<Label />} />
      </Link>
    )
    if (items.length) {
      return items
    } else if (!labels.isFetching) {
      return (
        <p>No labels :(</p>
      )
    }
  }

  render () {
    const {
      toggleNavigation,
      isOpen,
      routing
    } = this.props

    return (
      <LeftNav open={isOpen} docked={false} onRequestChange={toggleNavigation} className={styles.navigation}>
        <Link to={{ pathname: '/' }}>
          <MenuItem primaryText='Profile'
            leftIcon={<AccountCircle />}
            onTouchTap={() => toggleNavigation(false)}
          />
        </Link>
        <Divider />
        <Link to={{ pathname: '/document' }}>
          <MenuItem primaryText='Documents'
            leftIcon={<ViewModule />}
            onTouchTap={() => toggleNavigation(false)}
          />
        </Link>
        <Divider />
        <span className={styles.label}>Labels</span>
        { this.labels }
        <Link
          to={{ pathname: '/label/create', state: {modal: true, returnTo: routing.location.pathname, title: 'Create new label'} }}
          title='Create new label'>
          <MenuItem primaryText='Create label'
            leftIcon={<Add />}
            onTouchTap={() => toggleNavigation(false)}
          />
        </Link>
        <Divider />
        <Link to={{ pathname: '/' }}>
          <MenuItem primaryText='Trash'
            leftIcon={<Delete />}
          />
        </Link>
        <Link to={{ pathname: '/' }}>
          <MenuItem primaryText='Shares'
            leftIcon={<Share />}
          />
        </Link>
        <Divider />
        <Link to={{ pathname: '/' }}>
          <MenuItem primaryText='Settings'
            leftIcon={<Settings />}
          />
        </Link>
      </LeftNav>
    )
  }
}

const mapStateToProps = (state) => ({
  routing: state.routing,
  isOpen: state.navigation.isOpen,
  labels: state.labels
})

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({}, labelsActions, navigationActions), dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(AppNavigation)