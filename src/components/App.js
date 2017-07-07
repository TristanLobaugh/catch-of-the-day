import React from 'react';
import sampleFishes from '../sample-fishes';
import base from '../base';

import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';

class App extends React.Component {
    state = {
        fishes: {},
        order: {}
    };

    componentWillMount() {
        // runs right before app is rendered
        this.ref = base.syncState(
            `${this.props.params.storeId}/fishes`,
            {
                context: this,
                state: 'fishes'
            });
        // check to see if there is any order in local storage
        const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);

        if(localStorageRef) {
            this.setState({
                order: JSON.parse(localStorageRef)
            });
        }
    }

    componentWillUnmount() {
        base.removeBinding(this.ref);
    }

    componentWillUpdate(nextProps, nextState) {
        localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order))
    }

    addFish = (fish) => {
        // update state
        const fishes = {...this.state.fishes};

        // add in new fish
        const timeStamp = Date.now();
        fishes[`fish-${timeStamp}`] = fish;

        // set state
        this.setState({fishes});
    };

    updateFish = (key, updatedFish) => {
        const fishes = {...this.state.fishes};
        fishes[key] = updatedFish;
        this.setState({ fishes });
    };

    removeFish = (key) => {
        const fishes = {...this.state.fishes};
        fishes[key] = null;
        this.setState({ fishes });
    };

    loadSamples = () => {
        this.setState({
           fishes: sampleFishes
        });
    };

    addToOrder = (key) => {
        // take a copy of state
        const order = {...this.state.order};
        // update or add the new number of fish ordered
        order[key] = order[key] + 1 || 1;
        // update our state
        this.setState({ order });
    };

    removeOrder = (key) => {
        const order = {...this.state.order};
        delete order[key];
        this.setState({ order });
    };

    render() {
        return (
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market" />
                    <ul className="list-of-fishes">
                        {
                            Object
                                .keys(this.state.fishes)
                                .map(key => <Fish
                                                key={key}
                                                index={key}
                                                details={this.state.fishes[key]}
                                                addToOrder={this.addToOrder}
                                            />)
                        }
                    </ul>
                </div>
                <Order
                    removeOrder={this.removeOrder}
                    fishes={this.state.fishes}
                    order={this.state.order}
                    params={this.props.params}
                />
                <Inventory
                    addFish={this.addFish}
                    removeFish={this.removeFish}
                    loadSamples={this.loadSamples}
                    fishes={this.state.fishes}
                    updateFish={this.updateFish}
                    storeId={this.props.params.storeId}
                />
            </div>
        )
    }

    static propTypes = {
        params: React.PropTypes.object.isRequired
    };

}

export default App;
