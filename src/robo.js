import React from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import {
    Header,
    LearnMoreLinks,
    Colors,
    DebugInstructions,
    ReloadInstructions,
  } from 'react-native/Libraries/NewAppScreen';
import LiveVideo from './livevideo'

export default RoboControl = () => {
    return (
        <View style={styles.roboContainer}>
            <View style ={styles.roboHeader}><Text>Control Robot</Text></View>
            <View style = {styles.roboMoveControlContainer}>
                <Button title ='LF' ></Button>
                <Button title ='F'></Button>
                <Button title='RF'></Button>
            </View>
            <View style = {styles.roboCameraContainer}>
                <LiveVideo></LiveVideo>
            </View>
            <View style = {styles.roboMoveControlContainer}>
                <Button title='LB'></Button>
                <Button title='B'></Button>
                <Button title ='RB'></Button>
            </View>
            <View style = {styles.roboOptionsContainer}>
                <Button title='Analyze'></Button>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    roboContainer:{
        backgroundColor: 'powderblue', 
        flex: 1, 
        flexDirection: 'column', 
        justifyContent: "flex-start",

    },
    roboHeader: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'lightpink',
        height:55,
        fontWeight: 'bold'
    },
    roboMoveControlContainer: {flex: 1, flexDirection: 'row' ,backgroundColor:'grey'},
    roboCameraContainer: {flex:4, backgroundColor: 'lightgreen'},
    roboOptionsContainer: {flex:1, backgroundColor: 'lightblue'},
    sectionDescription: {
      marginTop: 8,
      fontSize: 18,
      fontWeight: '400',
      color: Colors.dark,
    },
    highlight: {
      fontWeight: '700',
    },
    footer: {
      color: Colors.dark,
      fontSize: 12,
      fontWeight: '600',
      padding: 4,
      paddingRight: 12,
      textAlign: 'right',
    },
  });