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
];

export default new Vuex.Store({
    strict: true,
    state: {
        failDemoCount: 0,
        count: 0,
        cars: [{
                id: 1,
                make: {
                    value: 'Toyota',
                    serverValue: 'Toyota',
                    isUpdating: false
                },
                model: {
                    value: 'Celica',
                    serverValue: 'Celica',
                    isUpdating: false
                },
                price: {
                    value: 3500,
                    serverValue: 3500,
                    isUpdating: false
                },
            },
            {
                id: 2,
                make: {
                    value: 'Ford',
                    serverValue: 'Ford',
                    isUpdating: false
                },
                model: {
                    value: 'Mondeo',
                    serverValue: 'Mondeo',
                    isUpdating: false
                },
                price: {
                    value: 3200,
                    serverValue: 3200,
                    isUpdating: false
                }
            },
            {
                id: 3,
                make: {
                    value: 'Porcshe',
                    serverValue: 'Porcshe',
                    isUpdating: false
                },
                model: {
                    value: 'Boxter',
                    serverValue: 'Boxter',
                    isUpdating: false
                },
                price: {
                    value: 72000,
                    serverValue: 72000,
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
        changeSingle(state, patchItemData) {

            const idx = state.cars.findIndex(car => car.id === patchItemData.id);

            // Method 1: construct a row object and update it
            // Error: erases other fields
            // const d = {
            //     // Copy whole object
            //     ...state.cars[idx],
            //     ...{
            //         // The sub object we interest to update
            //         [patchItemData.key]: {
            //             // the current sub-object values
            //             ...state.cars[idx][patchItemData.key],
            //             // new sub object values
            //             ...patchItemData.data
            //         }
            //     }
            // };

            // Use set to trigger reactivity
            // Vue.set(state.cars, idx, d);

            // Method 2: doesn't triggers reactivity althoud 
            // we update a sub object
            // state.cars[idx][patchItemData.key] = {
            //     // the current sub-object values
            //     ...state.cars[idx][patchItemData.key],
            //     // new sub object values
            //     ...patchItemData.data
            // };

            // Method 3: updates each field on the specific row and the specific sub object
            // Works, and tirggers reactivity and doesn't change other fields
            Object.keys(patchItemData.data).forEach(key => {
                // idx -> the row to update
                // patchItemData.key -> the sub object to update
                // key -> the property in the subobject to update
                state.cars[idx][patchItemData.key][key] = patchItemData.data[key];
            });
        }
    },

    actions: {
        patchItem({
            state,
            commit
        }, patchItemData) {

            //////////////////////////////////////////////////////////////
            // PatchItemData contains:                                  //                                                   
            //  object id to update (equal to row)                      //
            //  property to update (equals to subobject in the row)     //
            //  and value to set in that sub object                     // 
            //                                                          //
            //  example:                                                //
            //  {id, key, data: { value: } }                            //
            //////////////////////////////////////////////////////////////

            // Pay attention not to mutate "patchItemData"   
            commit('changeSingle', {
                ...patchItemData,
                data: {
                    value: patchItemData.data.value,
                    isUpdating: true
                }
            });

            setTimeout(() => {

                commit('updateFailDemoCount');

                if (state.failDemoCount % 2) {

                    // Update server values
                    commit('changeSingle', {
                        ...patchItemData,
                        data: {
                            isUpdating: false,
                            serverValue: patchItemData.data.value
                        }
                    });

                } else {

                    // Restore server values
                    const item = state.cars.find(car => car.id === patchItemData.id);

                    commit('changeSingle', {
                        ...patchItemData,
                        data: {
                            value: item[patchItemData.key].serverValue,
                            isUpdating: false
                        }
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