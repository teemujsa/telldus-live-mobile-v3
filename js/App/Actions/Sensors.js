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
 * @providesModule Actions_Sensors
 */

// @flow

'use strict';

import type { ThunkAction, Action } from './Types';

import LiveApi from 'LiveApi';

function getSensors(): ThunkAction {
	return (dispatch, getState) => {
		const payload = {
			url: '/sensors/list?includeValues=1',
			requestParams: {
				method: 'GET',
			},
		};
		return LiveApi(payload).then(response => dispatch({
			type: 'RECEIVED_SENSORS',
			payload: {
				...payload,
				...response,
			},
		}));
	};
}

function processWebsocketMessageForSensor(action: string, data: Object): Action {
	switch (action) {
		case 'value':
			return {
				type: 'SENSOR_UPDATE_VALUE',
				payload: data,
			};
		default:
	}

	return {
		type: 'SENSOR_WEBSOCKET_UNHANDLED',
		payload: data,
	};
}

module.exports = {
	getSensors,
	processWebsocketMessageForSensor,
};
