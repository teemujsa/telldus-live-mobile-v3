/**
 * Copyright 2016-present Telldus Technologies AB.
 *
 * This file is part of the Telldus Live! app.
 *
 * Telldus Live! app is free : you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Telldus Live! app is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Telldus Live! app.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @providesModule TabsView
 */

// @flow

'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { Image, Dimensions, TouchableOpacity } from 'react-native';

import { Icon, View, Header } from 'BaseComponents';

import { toggleEditMode, syncWithServer, switchTab } from 'Actions';
import TabViews from 'TabViews';

import { getUserProfile } from '../../Reducers/User';
import { TabNavigator } from 'react-navigation';
import { SettingsDetailModal } from 'DetailViews';
import Theme from 'Theme';

const RouteConfigs = {
	Dashboard: {
		screen: TabViews.Dashboard,
	},
	Devices: {
		screen: TabViews.Devices,
	},
	Sensors: {
		screen: TabViews.Sensors,
	},
	Scheduler: {
		screen: TabViews.Scheduler,
	},
	Gateways: {
		screen: TabViews.Gateways,
	},
};

const TabNavigatorConfig = {
	initialRouteName: 'Dashboard',
	swipeEnabled: false,
	lazy: true,
	animationEnabled: false,
	tabBarOptions: {
		activeTintColor: '#e26901',
	},
};

const Tabs = TabNavigator(RouteConfigs, TabNavigatorConfig);

type Props = {
	tab: string,
	userIcon: boolean,
	userProfile: Object,
	dashboard: Object,
	onTabSelect: (string) => void,
	onToggleEditMode: (string) => void,
	dispatch: Function,
};

type Tab = {
	index: number,
	routeName: string,
};

type State = {
	tab: Tab,
	settings: boolean,
};

class TabsView extends View {
	props: Props;
	state: State;

	onNavigationStateChange: (Object, Object) => void;
	onOpenSetting: () => void;
	onCloseSetting: () => void;
	onToggleEditMode: () => void;
	goAddSchedule: () => void;

	constructor(props: Props) {
		super(props);

		this.state = {
			tab: {
				index: 0,
				routeName: 'Dashboard',
			},
			settings: false,
		};

		this.tabNames = ['dashboardTab', 'devicesTab', 'sensorsTab', 'schedulerTab', 'gatewaysTab'];

		this.settingsButton = {
			icon: {
				name: 'gear',
				size: 22,
				color: '#fff',
			},
			onPress: this.onOpenSetting,
		};

		this.starButton = {
			icon: {
				name: 'star',
				size: 22,
				color: '#fff',
			},
			onPress: this.onToggleEditMode,
		};

		this.deviceWidth = Dimensions.get('window').width;

		this.addButtonSize = this.deviceWidth * 0.134666667;
		this.addButtonOffset = this.deviceWidth * 0.034666667;
		this.addButtonTextSize = this.deviceWidth * 0.056;

		this.styles = {
			addButton: {
				backgroundColor: Theme.Core.brandSecondary,
				borderRadius: 50,
				position: 'absolute',
				height: this.addButtonSize,
				width: this.addButtonSize,
				bottom: 50 + this.addButtonOffset,
				right: this.addButtonOffset,
				shadowColor: '#000',
				shadowOpacity: 0.5,
				shadowRadius: 2,
				shadowOffset: {
					height: 2,
					width: 0,
				},
				flex: 1,
				alignItems: 'center',
				justifyContent: 'center',
			},
			iconPlus: {
				width: this.addButtonTextSize,
				height: this.addButtonTextSize,
			},
		};
	}

	onNavigationStateChange = (prevState, newState) => {
		const index = newState.index;

		const tab = {
			index,
			routeName: newState.routes[index].routeName,
		};

		this.setState({ tab });
		this.props.onTabSelect(this.tabNames[index]);
	};

	onOpenSetting = () => {
		this.setState({ settings: true });
	};

	onCloseSetting = () => {
		this.setState({ settings: false });
	};

	onToggleEditMode = () => {
		const tab = this.tabNames[this.state.tab.index];
		this.props.onToggleEditMode(tab);
	};

	goAddSchedule = () => {
		//this.props.navigation.navigate('AddSchedule');
	};

	render() {
		const { routeName } = this.state.tab;

		let rightButton;

		if (routeName === 'Dashboard') {
			rightButton = this.settingsButton;
		} else if (routeName === 'Devices' || routeName === 'Sensors') {
			rightButton = this.starButton;
		} else {
			rightButton = null;
		}

		return (
			<View>
				<Header rightButton={rightButton}/>
				<Tabs onNavigationStateChange={this.onNavigationStateChange}/>
				{
					routeName === 'Scheduler' ? (
						<TouchableOpacity onPress={this.goAddSchedule}>
							<View style={this.styles.addButton}>
								<Image
									source={require('./img/iconPlus.png')}
									style={this.styles.iconPlus}
								/>
							</View>
						</TouchableOpacity>
					) : null
				}
				{
					this.state.settings ? (
						<SettingsDetailModal isVisible={true} onClose={this.onCloseSetting}/>
					) : null
				}
			</View>
		);
	}
}

function mapStateToProps(store) {
	return {
		tab: store.navigation.tab,
		userIcon: false,
		userProfile: getUserProfile(store),
	};
}

function mapDispatchToProps(dispatch) {
	return {
		onTabSelect: (tab) => {
			dispatch(syncWithServer(tab));
			dispatch(switchTab(tab));
		},
		onToggleEditMode: (tab) => dispatch(toggleEditMode(tab)),
		dispatch,
	};
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(TabsView);
