import React, { Component } from 'react';
import ReviewNew from './ReviewNew/ReviewNew';
import ReviewList from './ReviewList/ReviewList';

class ReviewContainer extends Component {
    constructor(){
        super();

        this.state ={
            reviews: [],
            newReview: {
                name: '',
                stars: 0,
                note: '',
            },
            showModal: false,
        }
    }

    componentDidMount(){
        this.getReviews();
    }

    showModal = () => {
        console.log('in the showmodal function', this.state.showModal);
        this.setState({
            showModal: !this.state.showModal,
        })
    }

    handleInput = (e) => {
        console.log(e.target.value, 'in the handleInput for:', e.target.name);
        this.setState({
            newReview: {
                ...this.state.newReview,
                [e.target.name]: e.target.value,
            }
        }, () => {
            console.log(`The new review state is now: ${JSON.stringify(this.state.newReview)}`)
        })
    }

    getReviews = async () => {
        try{
            const reviewResponse = await fetch(process.env.REACT_APP_BACKEND + 'api/reviews/');
            if(!reviewResponse) {
                throw Error(reviewResponse.statusText);
            }

            const parsedReviews = await reviewResponse.json();
            console.log(`Django sent these reviews: ${JSON.stringify(parsedReviews)}`);
            this.setState({
            reviews: parsedReviews,
            })
        }catch(err){
            console.log(err);
        }
    }

    newReview = async (e) => {
        e.preventDefault();
        try{
            const newRevResponse = await fetch((process.env.REACT_APP_BACKEND + 'api/reviews/'), {
                method: "POST",
                body: JSON.stringify(this.state.newReview),
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if(!newRevResponse.ok){
                throw Error(newRevResponse.statusText);
            }
            const parsedResponse = await newRevResponse.json();
            console.log(`POST request sent back:${JSON.stringify(parsedResponse)}`);

            this.setState({
                reviews: [
                    ...this.state.reviews,
                    parsedResponse,
                ]
            })
        }catch(err){
            console.log(err);
        }
    }

    render() {
        console.log(this.state);
        const reviewList = this.state.reviews.map((review, i)=>{
            console.log(`sending state review data of: ${JSON.stringify(review)} to ReviewList`)
            return(
                <ReviewList key={i} review={review}/>
            )
        })
        return(
            <div>
                <h1>Review Time</h1>
                <button onClick={this.showModal}>Make New Review</button>
                {reviewList}
                {this.state.showModal ? <ReviewNew handleInput={this.handleInput} newReview={this.newReview} />: null}
            </div>
        )
    }
}

export default ReviewContainer;