import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import { Home } from './pages/Home'
import { Points } from './pages/Points'
import { Detail } from './pages/Detail'

const { Navigator, Screen } = createStackNavigator()

export function Routes() {
	return (
		<NavigationContainer>
			<Navigator
				screenOptions={{
					headerShown: false,
					cardStyle: {
						backgroundColor: '#f0f0f5'
					}
				}}
				>
				<Screen name='Home' component={Home} />
				<Screen name='Points' component={Points} />
				<Screen name='Detail' component={Detail} />
			</Navigator>
		</NavigationContainer>
	)
}
