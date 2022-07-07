import React from 'react';
import Header from './components/navHeader';
import {Link} from 'react-router-dom';

function App() {
    return (
        <div>
            <Header/>
            <div className={'text-center row justify-content-center pt-4'}>
                <div className={'col-md-4'}>
                    <div className={'mt-3'}>
                        <h2>Hi and welcome to Epichat</h2>
                        <h4>Where Epitech students meet and chat.</h4>
                    </div>

                    <div>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda, atque aut.
                        autem consequatur dignissimos eligendi expedita id modi.
                        omnis provident quidem vitae! At distinctio, enim nisi odio quam quo ratione?
                    </div>
                    <div>
                        <h4 className={'mt-5'}>
                            Wanna know more about Epichat?
                        </h4>
                        <p>click on the link below <br/> and see for yourself.</p>
                        Link to the <Link to="/About">About</Link> page.
                    </div>
                </div>

            </div>
        </div>
    )
}

export default App