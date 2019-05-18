/* eslint-disable no-console */
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
const sets = [
    [{
        make: 'Toyota',
        model: 'Celica',
        price: 35000
    }, {
        make: 'Ford',
        model: 'Mondeo',
        price: 32000
    }, {
        make: 'Porsche',
        model: 'Boxter',
        price: 72000
    }],
    [{
        make: 'Elantra',
        model: 'Hundai',
        price: 20000
    }, {
        make: 'BMW',
        model: 'X6',
        price: 5000
    }, {
        make: 'Fiat',
        model: 'Turiq',
        price: 1000
    }],
]


export default new Vuex.Store({
    strict: true,
    state: {
        failDemoCount: 0,
        count: 0,
        cars: [{
                make: {
                    value: 'Toyota',
                    serverValue: null,
                    isUpdating: false
                },
                model: {
                    value: 'Celica',
                    serverValue: null,
                    isUpdating: false
                },
                price: {
                    value: 3500,
                    serverValue: null,
                    isUpdating: false
                },
            },
            {
                make: {
                    value: 'Ford',
                    serverValue: null,
                    isUpdating: false
                },
                model: {
                    value: 'Mondeo',
                    serverValue: null,
                    isUpdating: false
                },
                price: {
                    value: 3200,
                    serverValue: null,
                    isUpdating: false
                }
            },
            {
                make: {
                    value: 'Porcshe',
                    serverValue: null,
                    isUpdating: false
                },
                model: {
                    value: 'Boxter',
                    serverValue: null,
                    isUpdating: false
                },
                price: {
                    value: 72000,
                    serverValue: null,
                    isUpdating: false
                }
            }
        ]
    },
    mutations: {
        updateFailDemoCount(state) {
            state.failDemoCount++;
        },
        changeSet(state) {
            state.count++;
            state.cars = sets[state.count % 2];
        },
        changeSingle(state, payload) {
            // The newCars array will hold 2 already reactive elements and a single new non reactive element 
            // const newCars = [
            //     ...state.cars.filter((element, idx) => idx !== payload.idx),
            //     payload.data
            // ];

            // Setting newCars array to state.cars, changes the newCars array and makes all of its
            // contained elements to be reactive!
            // state.cars = newCars;

            Vue.set(state.cars, payload.idx, payload.data)

        },
    },

    actions: {
        patchItem({
            state,
            commit
        }, payload) {

            const idx = state.cars.findIndex(item => item === payload.item);
            const originalItem = state.cars[idx];

            let data = {};
            Object.keys(payload.patchItem).forEach(key => {
                data[key] = {
                    ...originalItem[key],
                    ...{
                        ...payload.patchItem[key],
                        isUpdating: true
                    }
                }
            });

            commit('changeSingle', {
                idx,
                data: {
                    ...originalItem,
                    ...data
                }
            });

            setTimeout(() => {

                commit('updateFailDemoCount');

                if (state.failDemoCount % 2) {
                    data = {};
                    Object.keys(payload.patchItem).forEach(key => {
                        const newData = {
                            ...payload.patchItem[key],
                            isUpdating: false,
                            serverValue: payload.patchItem[key].value
                        };

                        data[key] = {
                            ...originalItem[key],
                            ...newData
                        };
                    })

                    commit('changeSingle', {
                        idx,
                        data: {
                            ...originalItem,
                            ...data
                        }
                    });


                } else {
                    commit('changeSingle', {
                        idx,
                        data: originalItem
                    });
                }


            }, 2500);
        },
        changeSingle({
            commit,
            state
        }) {
            fetch('https://api.myjson.com/bins/15psn9')
                .then(result => result.json())
                .then(rowData => {

                    let idx = Math.floor(Math.random() * rowData.length);
                    const data = rowData[idx];

                    idx = Math.floor(Math.random() * state.cars.length);

                    commit('changeSingle', {
                        idx,
                        data
                    });
                });
        }
    }
})