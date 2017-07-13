import ReactDOM from 'react-dom';
import React, {Component} from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import zip from 'lodash/zip';
import update from 'react-addons-update';
import createFragment from 'react-addons-create-fragment';

import './styles/app.scss'
import Collapsible from 'react-collapsible';

const customStyles = {
  content : {
    top                   : '45%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
  maxHeight             : '600px',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    
  }
};
class App extends Component {
constructor() {
    super();
    this.state = {
      modalIsOpen: false,
      modalIsOpen2: false,
      recipes: [],//simply recipes,ingredients
      ingredientCount: 3,
      finalArr: []  //displayed <ul>   
    };
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);//Modals
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }
componentDidMount() {
if(localStorage.recipes){
  var persist = JSON.parse(localStorage.recipes);
  this.setState({recipes: persist}, () => {
  persist.forEach((array)=>{
    this.createAccordian(array);
  })  
  }) 
}
}
  openModal() {
    this.setState({modalIsOpen: true});
    //console.log(this.state.finalArr)
  }//openModal2 is below these
  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = 'green';
  }
  closeModal2() {
    this.setState({modalIsOpen2: false, ingredientCount: 3});
  }
  closeModal() {
    this.setState({modalIsOpen: false, ingredientCount: 3});
  }//Modals
  onChange(e){
    this.setState({ [e.target.name]: e.target.value});
  }  
  onSubmit(e){
 e.preventDefault();    
 const { name } = this.refs;
 const recipe = {
  name: name.value.trim(),
  ingredients: []
 }
 for (const ingredient in this.refs){
if (ingredient !== 'name' && this.refs[ingredient].value !== '' && this.refs[ingredient].value != undefined) {  
  recipe.ingredients.push(this.refs[ingredient].value)
}
 }
// console.log(recipe.name.length)
//console.log(this.refs.name.value)
if(recipe.name.length == 0 || recipe.ingredients.length ==0) {
  this.closeModal();
} else {
 this.setState({recipes: this.state.recipes.concat([recipe])}, () => {
   localStorage.setItem('recipes', JSON.stringify(this.state.recipes));    
  // console.log(this.state.recipes);
  this.createAccordian();
 });
 this.closeModal();  
}
  }//end-onSubmit
  onSubmit2(e) {//Edit
    e.preventDefault();
    //console.log(this.refs)
const { name } = this.refs;
 const recipe = {
  name: name.value.trim(),
  ingredients: []
 }
 for (const ingredient in this.refs){
if (ingredient !== 'name' && this.refs[ingredient].value !== '' && this.refs[ingredient].value != undefined) {  
  recipe.ingredients.push(this.refs[ingredient].value)
}
 } 
  let arr = [], indexArr = {};
for (let index=0; index<this.state.finalArr.length; index++) {
    let data = this.state.finalArr[index].props['data-bla'];
     arr.push(data)
     indexArr[index] = data
  }

let removeDataset = this.refs.take;

let clicked = arr.indexOf(Number(removeDataset));

var q = update(this.state.recipes, {
   [clicked]:  {name: {$set: recipe.name } } })
q[clicked].ingredients = recipe.ingredients

let w = update(this.state.finalArr, {
  [clicked]: { props: {trigger: {$set: recipe.name}} }
});

let length = this.state.recipes[clicked].ingredients.length;
let greatArr = [];//for editing finalArr
for (let j=0; j<length; j++ ) {
  greatArr.push(w[0].props.children[0][j]);
}
for (let j=0; j<length; j++ ) {
  w[clicked].props.children[0][j] = <ul><li>{recipe.ingredients[j]}</li></ul>
}
console.log(w[0].props.children[0])
this.setState({finalArr: w, recipes: q}, () => {
localStorage.setItem('recipes', JSON.stringify(this.state.recipes));  
this.closeModal2()
})
  }//end-onSubmit2
chooseIngredients(){
  const { ingredientCount } = this.state;
  let ingredients = [];
  for (let i=0; i<ingredientCount; i++) {
const index = i+1;
let addOption, removeOption;
if(index == ingredientCount) {
  addOption = this.addIngredient.bind(this);
}
const ingredientInput = (
<div key={index}>
<label>Ingredient {index}:</label>
  <input type='text'
  ref={`ingredient${index}`} 
  onFocus={addOption}
  onBlur={removeOption}
  placeholder='Enter ingredient...'/>
</div>
  )
  ingredients.push(ingredientInput)
  }//end-forloop
  return ingredients
}//end-chooseIngredients adds options
addIngredient() {
    this.setState({ingredientCount: this.state.ingredientCount + 1})
  }
removeIngredient() {
    this.setState({ingredientCount: this.state.ingredientCount - 1})
  }//option + -
createAccordian(array) {
 if(array){//console.log(array)
let y,z; let l = this.state.recipes.length; 
let initArr = [];
for (let j=0; j<l ;j++ ) {
 y = this.state.recipes[j].ingredients.map((recipe, i) => (<div key={i}>
      <ul>
        <li>{recipe}</li>
      </ul>
    </div>))
z = <Collapsible  data-bla={j+6} trigger={this.state.recipes[j].name}>
  {y}
  <button data-bla={j+6} onClick={this.delete.bind(this)}>delete</button>  
  <button data-bla={j+6} onClick={this.edit.bind(this)}>edit</button>  
</Collapsible>
initArr.push(z);  
}
this.setState({finalArr: this.state.finalArr.concat(initArr)})
 
 } else {//without array do following
  let x = (<div>
      <Collapsible trigger="Start here">
        <p>This is the collapsible content. It can be any element or React component you like.</p>
        <p>It can even be another Collapsible component. Check out the next section!</p>
      </Collapsible>   
    </div>)
let y,z; let l = this.state.recipes.length; 
if(this.state.recipes.length == 0 ) {//create accordians
  let y;
} else {
 y = this.state.recipes[l-1].ingredients.map((recipe, i) => (<div key={i}>
      <ul>
        <li>{recipe}</li>
      </ul>
    </div>))
z = <Collapsible  data-bla={l+5} trigger={this.state.recipes[l-1].name}>
  {y}
  <button data-bla={l+5} onClick={this.delete.bind(this)}>delete</button>  
  <button data-bla={l+5} onClick={this.edit.bind(this)}>edit</button>  
</Collapsible>
//console.log(z.props)
this.setState({finalArr: this.state.finalArr.concat(z)})
} 
 }
}//end-createAccordian
edit(e) {
  let arr = [];
  let locateDataset = e.target.dataset.bla;
for (let index=0; index<this.state.finalArr.length; index++) {
    //console.log(this.state.finalArr[index].props['data-bla'])
    let data = this.state.finalArr[index].props['data-bla'];
     arr.push(data)
  }
//console.log(arr.indexOf(Number(locateDataset)))
let spot = arr.indexOf(Number(locateDataset));//finds index by data-attr
this.openModal2(this.state.recipes[spot], e);
}//end-edit
openModal2(obj, e) {//for edit modal
e.persist()
this.setState({ingredientCount: obj.ingredients.length});
    this.setState({modalIsOpen2: true}, () => 
      {this.refs.name.value = obj.name,

        obj.ingredients.forEach((ingredient, i)=> {
          this.refs['ingredient' + (i+1)].value = ingredient
        },
        this.refs.take = e.target.dataset.bla)

          }
      );
//}   
  }//end-openModal2
delete(e) {
  let arr = [];//array of dataset i.e. 6,7,
  let removeDataset = e.target.dataset.bla;
  let removeRecipe = this.state.finalArr.slice();  
  //console.log(this.state.finalArr[0].props['data-bla'])
 for (let index=0; index<this.state.finalArr.length; index++) {
    //console.log(this.state.finalArr[index].props['data-bla'])
    let data = this.state.finalArr[index].props['data-bla'];
     arr.push(data)
  }
let removeRecipeState = this.state.recipes;
removeRecipeState.splice(arr.indexOf(Number(removeDataset)), 1)

 removeRecipe.splice(arr.indexOf(Number(removeDataset)), 1)
  this.setState({finalArr: removeRecipe, recipes: removeRecipeState}, () => {
  localStorage.setItem('recipes', JSON.stringify(this.state.recipes));      
  })//works
}
  render() {
let ingredients = this.chooseIngredients();
    return (
      <div>
      {this.state.finalArr}

        <button onClick={this.openModal}>Open Modal</button>

        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Test Modal" >
          <h2 ref={subtitle => this.subtitle = subtitle}>Enter Recipe</h2>
          <form onChange={this.onChange} onSubmit={this.onSubmit}>
          <label>Recipe:</label>
            <input id='test' ref='name' type='text' placeholder='Enter Recipe Name' />
            {ingredients}
            <br/>
<button onClick={this.closeModal}>Close</button>
<input type='submit' value='Submit' />                               
          </form>    
        </Modal>

        <Modal//modal for editing
          isOpen={this.state.modalIsOpen2}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal2.bind(this)}
          style={customStyles}
          contentLabel="Test Modal2" >
          <h2 ref={subtitle => this.subtitle = subtitle}>Enter Recipe</h2>
          <form onChange={this.onChange} onSubmit={this.onSubmit2.bind(this)}>
          <label>Recipe:</label>
            <input id='test' ref='name' type='text' placeholder='Enter Recipe Name' />
            {ingredients}
            <br/>
<button onClick={this.closeModal2.bind(this)}>Close</button>
<input type='submit' value='Edit' />                               
          </form>    
        </Modal>        

      </div>
    );
  }
}

ReactDOM.render(<App />,
  document.getElementById('root'));