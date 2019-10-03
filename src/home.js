import React from 'react'
import { PermissionsAndroid, View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native'

// Library to get Geolocation with JS with react native
// https://github.com/react-native-community/react-native-geolocation
import Geolocation from '@react-native-community/geolocation'

// Library to get Distance with two coordinates with JS
// https://github.com/manuelbieh/geolib
import { getDistance } from 'geolib';

export default class Home extends React.Component {
	state = {
		phoneLatitude: 0,
		phoneLongitude: 0,
		
		petLatitude: 0,
		petLongitude: 0,

		distance: 0,
		message: 'Você está a uma distância segura do seu PET :)'
		
	}

	messages = [
		'Você está a uma distância segura do seu PET :)',
		'Você está a mais de 20m de distância do seu PET!'
	]

	SetPetLocation = () => {
		Geolocation.getCurrentPosition(
			position => {
				this.setState({
					petLatitude: position.coords.latitude,
					petLongitude: position.coords.longitude
				})
			},

			error => alert('Ops, houve um erro: ' + error.message)
		)
	}

	SetPhoneLocation = () => {
		Geolocation.getCurrentPosition(
			position => {
				this.setState({
					phoneLatitude: position.coords.latitude,
					phoneLongitude: position.coords.longitude
				})
			},

			error => alert('Ops, houve um erro: ' + error.message)
		)
	}

	Distance = () => {
		this.SetPhoneLocation()
		
		setTimeout( () => {
			let distance = getDistance(
				{ latitude: this.state.phoneLatitude, longitude: this.state.phoneLongitude },
				{ latitude: this.state.petLatitude, longitude: this.state.petLongitude}
			)
	
			if (distance > 20){
				this.setState({ message: this.messages[1], distance })
			}
			else {
				this.setState({ message: this.messages[0], distance })
			}
		}, 500)		
	}	
	
	render() {
		return (
			<View style={ styles.container }>
				<TouchableOpacity onPress={ this.SetPetLocation }>
					<Image
						style={ styles.park }
						source={ require('./../assets/park.png') }
					/>
					<Text style={ styles.title }>PET Monitor</Text>
				</TouchableOpacity>

				<View style={ styles.info }>
					<Text	style={ [styles.message, (this.state.distance > 20 ? styles.messageWarning : styles.messageRelax)] }>{ this.state.message }</Text>
					<Text style={ styles.details }>Distância aproximada de { this.state.distance } metros.</Text>				
				</View>
				
				<View>
					<Text>Latitude do Pet</Text>
					<TextInput 
						name='petLatitude' 
						placeholder='Latitude'
						keyboardType='numeric' 
						style={ styles.input }
						onChangeText={ (petLatitude) => this.setState({ petLatitude })}
						value={ this.state.petLatitude.toString() }
					/>

					<Text>Longitude do Pet</Text>
					<TextInput 
						name='petLongitude' 
						placeholder="Longitude" 
						keyboardType='numeric' 
						style={ styles.input }
						onChangeText={ (petLongitude) => this.setState({ petLongitude }) }
						value={ this.state.petLongitude.toString() }
					/>

					<Button 
						title='Verificar distância'
						onPress={ this.Distance }
						style={ styles.button }
					/>
				</View>
			</View>
			)
		}
	}
	
	const styles = StyleSheet.create({
		container: {
			flex: 1,
			alignItems: 'center',
			justifyContent: 'center',
			color: '#000',
			backgroundColor: '#ecf0f1'
		},
		
		park: {
			width: 100,
			resizeMode: 'contain',
			margin: 10
		},

		title: {
			fontSize: 18,
			fontWeight: 'bold',
		},

		input: {
			borderWidth: 1,
			borderColor: '#555',
			borderRadius: 4,
			padding: 2,
			marginBottom: 15,
			width: 250
		},

		info: {
			margin: 65,
			alignItems: 'center',
			justifyContent: 'center',
		},

		message: {
			fontSize: 20,
			fontWeight: 'bold',
			textAlign: 'center',
			marginBottom: 0
		},

		messageWarning: {
			color: 'orange'
		},

		messageRelax: {
			color: 'green'
		},

		details: {
			color: '#666'
		}
})