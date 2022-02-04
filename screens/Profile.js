import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import firebase from "firebase"

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      isEnabled:false,
      lightTheme:true,
      profileImage:"",
      name:""
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }
  togglesSwitch(){
    const previous_state=this.state.isEnabled
    const theme=!this.state.isEnabled?"dark":"light"
    var updates={}
    updates[
      "/users/"+firebase.auth().currentUser.uid+"/current_theme"
    ]=theme
    firebase.database().ref().update(updates)
    this.setState({
      isEnabled:!previous_state,light_theme:previous_state
    })
  }

  componentDidMount() {
    this._loadFontsAsync();
  }

  async fetchUser(){
    let theme,name,image
    await firebase
    .database()
      .ref("/users/"+ firebase.auth().currentUser.uid)
      .on ("value",function(snapshot){
        theme=snapshot.val().current_theme;
        name=`${snapshot.val().firstName}${snapshot.val().lastName}`
        image=snapshot.val().profile_picture
      })
      this.setState({
         isEnabled:theme==="light"?false:true,
      lightTheme:theme==="light"?true:false,
      profileImage:image,
      name:name
      })
    
  } 

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />
    } else {
      return (
        <View style={styles.container}>
          <Text>Profile</Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
