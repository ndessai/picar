/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconFeather from 'react-native-vector-icons/Feather';
import { Slider } from 'react-native-elements';

import AWS from 'aws-sdk/dist/aws-sdk-react-native';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  TouchableOpacity,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const App: () => React$Node = () => {

  // Set the region 
  

  recordClick = () =>  {
   
    AWS.config.update({region: 'us-east-2'});

  var sqs = new AWS.SQS(
    {apiVersion: '2012-11-05',
    accessKeyId:'AKIARP37NQ3K7ES4VH77',
    secretAccessKey: '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'});



    var params = {
      MessageBody: 'Record', /* required */
      QueueUrl: 'https://sqs.us-east-2.amazonaws.com/102809568981/RaspiCommands.fifo', /* required */
      
      MessageAttributes: {
        "Title": {
          DataType: "String",
          StringValue: "The Whistler"
        },
        "Author": {
          DataType: "String",
          StringValue: "John Grisham"
        },
        "WeeksOn": {
          DataType: "Number",
          StringValue: "6"
        }
      },
      MessageDeduplicationId: "Command",  // Required for FIFO queues
      MessageGroupId: "Pi"  // Required for FIFO queues
      
    };
    sqs.sendMessage(params, function(err, data) {
      if (err) alert(err, "Error"+ err.stack); // an error occurred
      else     alert(data);           // successful response
    });
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.recordContainer}>
        <TouchableOpacity onPress={this.recordClick}>
          <View style={styles.button}>
           <Text >
            <Icon name="circle" size={30} color="#900" />
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.recordClick}>
          <View style={styles.button}>
            <Text >
            <IconFeather name="cast" size={30} color="#900" />
            </Text>
          </View>
        </TouchableOpacity>
        </View>
        <View style={styles.imageContainer}>
          <View style={{flex: 1, justifyContent: "center"}}>
          <Video source={{uri: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4"}}   // Can be a URL or a localfile.
       ref={(ref) => {
         this.player = ref
       }}                                      // Store reference
       onBuffer={this.onBuffer}                // Callback when remote video is buffering
       onEnd={this.onEnd}                      // Callback when playback finishes
       onError={this.videoError}               // Callback when video cannot be loaded
       style={styles.backgroundVideo} />
</View>
<View style={{ flex: 1, margin: 30, alignItems: 'stretch', justifyContent: 'center', width: 300 }}>
  <Slider
    value={100}
  />
</View>

          </View>

      <View style={styles.analyzeContainer}>
      <TouchableOpacity onPress={this.recordClick}>
          <View style={styles.button}>
            <Icon name="compass" size={30} color="#900" />
          </View>
        </TouchableOpacity>
        
      </View>
      
          </View>
    </>
  );
};

const styles = StyleSheet.create({
  container:{ flex: 1, justifyContent: "center"},
  recordContainer: {
    backgroundColor: Colors.lighter,
    flex:1,
    flexDirection: 'row',
    marginTop: 80,
    justifyContent: "center"
  },
  analyzeContainer: {
    flex:1,
    margin: 20,
    backgroundColor: Colors.lighter, 
    alignItems: "center"
  },
  imageContainer:{ flex: 5, justifyContent: "center"},
  button: {
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    alignItems:'center',
    justifyContent:'center',
    width:40,
    height:40,
    backgroundColor:'#fff',
    borderRadius:50,
    margin:40
  },
  buttonText: {
    textAlign: 'center',
    padding: 20,
    color: 'white'
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
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

export default App;
