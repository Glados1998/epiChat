import React from 'react';
import Header from "../components/navHeader";

const About = () => {
    return (
        <div>
            <Header/>
            <div className={'text-center row justify-content-center pt-4'}>
                <div className={'col-md-4'}>
                    <div className={'mt-3'}>
                        <h2>About Epichat...</h2>
                        <h5>Epichat or my_irc is a MEARN stack project made in the second semester
                            of the Web@cademie study here in Epitech Mulhouse.</h5>
                        <h5 className={'mt-4'}>
                            With Epichat you can communicate with your friends and colleagues in real time. <br/>
                            You can also create your own channels.
                        </h5>
                    </div>
                </div>
            </div>
        </div>
    )
};
export default About