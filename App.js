import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  AsyncStorage,
  Alert,
  ImageBackground,
  FlatList,
  Picker
} from 'react-native';
import { Icon, Button } from 'react-native-elements'
import Constants from 'expo-constants';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

export default function App() {
  const [todo, setTodo] = useState({
    text: '',
    done: false,
    input: false,
    done: false
  })
  const [todos, setTodos] = useState([])
  const [removed, setRemoved] = useState([])
  const [newTodo, setNewTodo] = useState()

  useEffect(() => {
    (async () => {
      // await AsyncStorage.removeItem('todos')
      // await AsyncStorage.removeItem('removed')
      let todos = await AsyncStorage.getItem('todos')
      let removed = await AsyncStorage.getItem('removed')
      console.log('removed ==>',removed)
      todos === null
        ? await AsyncStorage.setItem('todos', JSON.stringify([]))
        : setTodos([...JSON.parse(todos)])
      todos === null
      ? await AsyncStorage.setItem('removed', JSON.stringify([]))
      : setRemoved([...JSON.parse(removed)])
     })()
  }, [])

  useEffect(() => {
    console.log('removed', removed)
  }, [removed])


  const createTodo = async () => {
    let temp = await AsyncStorage.getItem('todos')
    let parseTemp = JSON.parse(temp)
    let index = parseTemp.findIndex(item => item.text === todo.text)
    if(index !== -1 || !todo.text) {
      return Alert.alert(
      !todo.text
      ? 'Please provide a valid todo'
      : '😢 Sorry, this todo already exist',
        '',
        [{text: 'close', onPress: ()=> console.log('close button pressed')}]
        )
    }
    parseTemp.push(todo)
    setTodos(parseTemp)
    setTodo({...todo, text: ''})
    AsyncStorage.setItem('todos', JSON.stringify(parseTemp))
  }

  const removeTodo = async (todo) => {
  
    let temp = await AsyncStorage.getItem('todos')
    let temp2 = await AsyncStorage.getItem('removed')
    let parseTemp = JSON.parse(temp)
    let parseTemp2 = JSON.parse(temp2)
    let index = parseTemp2.findIndex( item => item.text === todo.text)
    if (index === -1) {
      parseTemp2.push(todo)
    }
    let index2 = parseTemp.findIndex(item => item.text === todo.text)
    parseTemp.splice(parseTemp.indexOf(todo), 1)
    await AsyncStorage.setItem('todos', JSON.stringify(parseTemp))
    await AsyncStorage.setItem('removed', JSON.stringify(parseTemp2))
    setRemoved(parseTemp2)
    setTodos(parseTemp)
  }
 
  const confirmRemove = (todo) => {
    Alert.alert(
      'Yo did it!',
      'Are you sure?',
      [
        {text:'Yes!', onPress: () => removeTodo(todo)},
        {text: 'Not done yet', onPress: () => console.log('no press from alert!')}
      ]
    )
  }
  const toggleInput = index => {
    let temp = todos
    temp.forEach((ele, i) => index !== i ? ele.input = false : null)
    todos[index].input = !todos[index].input
    setTodos([...temp])
  }

  useEffect(() => {
   setNewTodo('')
  }, [todos])

  const updateTodoText = index => {
    let temp = todos
    temp[index].text = newTodo
    temp[index].input = false
    setTodos([...temp])
    setNewTodo('')
  }

  const toggleDone = index => {
    let temp = todos
    temp[index].done = !temp[index].done
    setTodos([...temp])
  }

  const renderTodo = (todo, index) => {
    return (<View  style={styles.todo_container}>
    <TouchableOpacity onPress={()=> toggleInput(index)}>
      <Icon
        name='edit-2'
        type='feather'
        color='#FFF3AD'
        size={30}
      />
    </TouchableOpacity>
    {
      todo.input ? <TextInput
      style={styles.edit_input}
      onChangeText={text => setNewTodo(text)}
      value={newTodo}
      onSubmitEditing={()=> updateTodoText(index)}
      placeholder={todo.text}
      /> : (
        <TouchableOpacity onPress={() => toggleDone(index)}>
           <Text style={[styles.text, {textDecorationLine: todo.done ? 'line-through' : 'none'}]}>{todo.text}</Text>
        </TouchableOpacity>
     )
    }
    
    <TouchableOpacity onPress={() => confirmRemove(todo)}>
      <Icon
        name='check-square'
        type='feather'
        color='#BCFFBC'
        size={30}
      />
    </TouchableOpacity>
  </View>)
  }

  return (
    <ImageBackground source={require('./assets/bg-unicorn.png')} style={styles.container}>
      {/* input container */}
      <View style={styles.input_container}>
        <TextInput
          style={styles.input}
          onSubmitEditing={()=> createTodo()}
          onChangeText={text => setTodo({...todo,text})}
          value={todo.text} />
        <Button
          icon={{
            name: "plus",
            size: 36,
            color: "#C9B1FF",
            type: 'feather',
          }}
          style={styles.button}
          // title="Add todo"
          type='outline'
          onPress={() => createTodo()}
        />
      </View>
      {/* todos container */}
      <ScrollView style={styles.todos_container}>
        <FlatList 
          data={todos}
          renderItem={ ({item, index}) => renderTodo(item, index) }
          keyExtractor={item => item.text }
        />
      </ScrollView>
      <View style={styles.footer}>
          {removed.length > 0 ? (
            <View style={styles.picker}>
             <Picker
             itemStyle={{ color: "orange" }}
             selectedValue={'Old todos'}
             onValueChange={
               (itemValue, itemIndex) => setTodo({...todo, text: itemValue})
             }
           >
             <Picker.Item label='Old todos'/>
             {removed.map( (item, index) => {
               return <Picker.Item key={index} label={item.text} value={item.text}/> 
             })
             }
            </Picker>
            </View>
          ) : null}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: Constants.statusBarHeight,
  },
  input_container: {
    width: '100%',
    height: '15%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  input: {
    height: '50%',
    width: '80%',
    borderColor: '#C9B1FF',
    borderWidth: 2,
    marginRight: 10,
    fontSize: RFPercentage(4),
    padding: 8,
    color: '#C9B1FF',
  },
  edit_input : {
    height: '100%',
    width: '70%',
    borderColor: '#C9B1FF',
    borderWidth: 2,
    marginRight: 10,
    fontSize: RFPercentage(4),
    padding: 8,
    color: '#C9B1FF',
  },
  todos_container: {
    width: '100%',
    height: '85%',
  },
  todo_container: {
    width: '100%',
    height: 60,
    margin: 4,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 20
  },
  text: {
    fontSize: RFPercentage(4),
    letterSpacing: 1,
    fontWeight: 'bold',
    color: '#FFB2B1',
    textDecorationStyle: 'double',
    textDecorationLine: 'line-through',
    textDecorationColor: '#FFB2B1'
  }, 
  button: {
    borderWidth: 2,
    borderColor: '#C9B1FF',
    color: '#C9B1FF',
    fontSize: RFPercentage(4),
  },
  footer: {
    width: '100%',
    height: '10%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  picker: {
    width: 200,
    height: 60,
    borderWidth: 2,
    borderColor: '#C9B1FF'
  }
});


