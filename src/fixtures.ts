import { Recipe } from "./types";

export const recipeFixture: Recipe = {
    id: '1',
    title: 'Content from anxiety',
    description: 'Description 1',
    steps: ['Take a breath', 'Look up to the sky', 'Name 10 things I\'m grateful for'],
    states: {
        from: 'anxious',
        to: 'content'
    },
    style: {
        color: '#ff9900',
        backgroundColor: '#12121c',
        backgroundImageUrl: ''
    }
}