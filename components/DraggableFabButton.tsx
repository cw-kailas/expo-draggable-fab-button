import React, { useState, useRef, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    StyleSheet,
    useWindowDimensions,
    Text,
} from 'react-native';

import Animated, {
    withTiming,
    withSpring,
    useSharedValue,
    useAnimatedStyle,
    Easing,
    useAnimatedGestureHandler,
} from "react-native-reanimated";

import { PanGestureHandler } from "react-native-gesture-handler";


const propTypes = {
    /* Count subtext on collapsed state */
    count: PropTypes.number,
    /* Value for DTI prop */
    'data-testing-id': PropTypes.string,
    /** If `true`, It will be visible */
    isVisible: PropTypes.bool,
    /* Initial text value to show with icon */
    text: PropTypes.string,
    /** Horizontal left position value of component from the window */
    xPositionValue: PropTypes.number,
    /** Vertical top position value of component from the window */
    yPositionValue: PropTypes.number,
    /** Callback fired when user start dragging the draggable button  */
    onPress: PropTypes.func,
    /** Callback fired when user dragging the draggable button */
    onDrag: PropTypes.func,
    /** Callback fired when user stop dragging the draggable button */
    onRelease: PropTypes.func,
    /** Callback fired when draggable button overlaps with close button and draggable button is released */
    onClose: PropTypes.func,
    /** Delay in milliseconds to hide the text after release (collapse) */
    hideTextAfterDelay: PropTypes.number,
    /** Delay in milliseconds to reduce opactiy to 0.5 after button is released */
    blurredBtnDelay: PropTypes.number,
    /** Boundary top value */
    boundaryTop: PropTypes.number,
    /** Boundary bottom value */
    boundaryBottom: PropTypes.number,
    /** Close button z-index value */
    closeButtonZIndex: PropTypes.number,
    /** Draggable button z-index value */
    draggableButtonZIndex: PropTypes.number,
};

const defaultProps = {
    count: 0,
    'data-testing-id': '',
    isVisible: true,
    text: '',
    xPositionValue: 6,
    yPositionValue: -300,
    onPress: () => { },
    onDrag: () => { },
    onRelease: () => { },
    onClose: () => { },
    hideTextAfterDelay: 3000,
    blurredBtnDelay: 2000,
    boundaryTop: 100,
    boundaryBottom: 100,
    closeButtonZIndex: 100,
    draggableButtonZIndex: 10,
};



function Box() {
    const xwidth = useSharedValue(50);

    const posX = useSharedValue(0);
    const posY = useSharedValue(0);

    const gestureHandler = useAnimatedGestureHandler({
        onStart: (_, ctx: any) => {
            ctx.startX = posX.value;
            ctx.startY = posY.value;
        },
        onActive: (event, ctx) => {
            posX.value = ctx.startX + event.translationX;
            posY.value = ctx.startY + event.translationY;
        },
        onEnd: (_) => {

            posX.value = withTiming(0);
            posY.value = withTiming(0);
            // posX.value = withSpring(0);
            // posY.value = withSpring(0);
        },
    });

    const animatedStyles = useAnimatedStyle(() => {
        return {
            width: withTiming(xwidth.value, {
                duration: 500,
                easing: Easing.linear,
            }),

            transform: [{ translateX: posX.value }, { translateY: posY.value }],
        };
    });

    return (
        <>
            <PanGestureHandler onGestureEvent={gestureHandler}>
                <Animated.View style={[{
                    width: 100,
                    height: 100,
                    backgroundColor: "lightpink",
                }, , animatedStyles]} />
            </PanGestureHandler>
        </>
    );
}


function DraggableFabButton({
    count,
    'data-testing-id': testingName,
    isVisible,
    text,
    xPositionValue,
    yPositionValue,
    onPress,
    onDrag,
    onRelease,
    onClose,
    hideTextAfterDelay,
    blurredBtnDelay,
    boundaryTop,
    boundaryBottom,
    closeButtonZIndex,
    draggableButtonZIndex,
}) {
    // const { height, width } = useWindowDimensions();
    // const pan = React.useRef(new AnimatedLegacy.ValueXY());
    // const draggableBtnTranslateY = useRef(new AnimatedLegacy.Value(0)).current;
    // const draggableBtnCollapseValue = useRef(new AnimatedLegacy.Value(0)).current;
    // const closeBtnScaleValue = useRef(new AnimatedLegacy.Value(1)).current;
    // const draggableBtnBackgroundValue = useRef(new AnimatedLegacy.Value(1)).current;
    // const countButtonBackgroundValue = useRef(new AnimatedLegacy.Value(1)).current;

    // const isCloseBtnTransitionAddedRef = useRef(false);
    // const isScaleAnimationAddedRef = useRef(false);
    // const overlappingRef = useRef(false);
    // const draggableButtonRef = useRef(null);
    // const counterWrapperRef = useRef(null);
    // const [collapse, setCollapse] = useState(false);
    // const closeBtnRef = useRef(null);
    // const [showDraggable, setShowDraggable] = useState(true);
    // const [timer, setTimer] = useState(null);
    // const [position, setPosition] = useState({
    //     x: xPositionValue,
    //     y: yPositionValue,
    // });
    const posX = useSharedValue(0);
    const posY = useSharedValue(0);



    // const handleCloseBtnTranslateY = (animationState = 'start') => {
    //     // start -> animate from 0 to 1
    //     // stop -> animate from 1 to 0
    //     AnimatedLegacy.timing(draggableBtnTranslateY, {
    //         toValue: animationState === 'start' ? 1 : 0,
    //         duration: 400,
    //         easing: Easing.inOut(Easing.quad),
    //         useNativeDriver: true,
    //     }).start();
    // };

    // const handleCloseBtnScale = (animationState = 'start') => {
    //     AnimatedLegacy.timing(closeBtnScaleValue, {
    //         toValue: animationState === 'start' ? 1.2 : 1,
    //         duration: 400,
    //         useNativeDriver: true,
    //     }).start();
    // };

    // const handleDraggableBtnCollapse = (animationState = 'start') => {
    //     AnimatedLegacy.timing(draggableBtnCollapseValue, {
    //         toValue: animationState === 'start' ? 1 : 0,
    //         duration: 500,
    //         useNativeDriver: false,
    //     }).start();
    // };

    // const handleDraggableBtnBackground = (animationState = 'start') => {
    //     AnimatedLegacy.timing(draggableBtnBackgroundValue, {
    //         toValue: animationState === 'start' ? 0 : 1,
    //         easing: Easing.inOut(Easing.quad),
    //         duration: 400,
    //         useNativeDriver: false,
    //     }).start();
    // };

    // const handleCountButtonBackground = (animationState = 'start') => {
    //     AnimatedLegacy.timing(countButtonBackgroundValue, {
    //         toValue: animationState === 'start' ? 0 : 1,
    //         easing: Easing.inOut(Easing.quad),
    //         duration: 400,
    //         useNativeDriver: false,
    //     }).start();
    // };

    // const translateYContainer = draggableBtnTranslateY.interpolate({
    //     inputRange: [0, 1],
    //     outputRange: [200, -200],
    // });

    // const collapseContainer = draggableBtnCollapseValue.interpolate({
    //     inputRange: [0, 1],
    //     outputRange: [200, buttonSize],
    // });

    // const draggableBtnBackgroundContainer = draggableBtnBackgroundValue.interpolate(
    //     {
    //         inputRange: [0, 1],
    //         outputRange: ['rgb(127, 215, 207)', 'rgb(0, 175, 160)'],
    //     }
    // );

    // const countBackgroundContainer = countButtonBackgroundValue.interpolate({
    //     inputRange: [0, 1],
    //     outputRange: ['rgb(242, 151, 136)', 'rgb(229, 48, 18)'],
    // });

    // const styles = useMemo(
    //     () =>
    //         StyleSheet.create({
    //             closeBtnWrapper: {
    //                 position: 'relative',
    //                 display: 'flex',
    //                 alignItems: 'center',
    //                 justifyContent: 'center',
    //                 width: buttonSize,
    //                 height: buttonSize,
    //                 backgroundColor: 'black',
    //                 opacity: 0.6,
    //                 borderColor: 'white',
    //                 borderWidth: 3,
    //                 borderRadius: buttonSize / 2,
    //                 shadowColor: 'black',
    //                 shadowOffset: {
    //                     width: 0,
    //                     height: 12,
    //                 },
    //                 shadowOpacity: 0.58,
    //                 shadowRadius: 16.0,
    //                 elevation: 24,
    //             },
    //             draggableButtonWrapper: {
    //                 position: 'absolute',
    //                 top: 0,
    //                 left: 0,
    //                 width: '100%',
    //                 height: '100%',
    //             },
    //             draggableButton: {
    //                 display: 'flex',
    //                 alignItems: 'center',
    //                 justifyContent: 'center',
    //                 flexDirection: 'row',
    //                 fontWeight: 'bold',
    //                 backgroundColor: 'teal',
    //                 height: buttonSize,
    //                 width: collapse ? buttonSize : 200,
    //                 borderRadius: buttonSize / 2,
    //                 shadowColor: '#000',
    //                 shadowOffset: {
    //                     width: 0,
    //                     height: 12,
    //                 },
    //                 shadowOpacity: 0.58,
    //                 shadowRadius: 16.0,
    //             },
    //             text: {
    //                 color: 'white',
    //                 marginRight: 8,
    //                 // fontFamily: 'regular',
    //                 // fontWeight: 'bold',
    //             },
    //             counterTextWrapper: {
    //                 position: 'absolute',
    //                 top: 0,
    //                 right: 0,
    //                 borderRadius: 10,
    //                 display: 'flex',
    //                 flexDirection: 'row',
    //                 alignItems: 'center',
    //                 justifyContent: 'center',
    //                 width: 20,
    //                 height: 20,
    //                 backgroundColor: 'red',
    //             },
    //             counterText: {
    //                 color: 'white',
    //                 // fontFamily: 'regular',
    //                 // fontWeight: 'bold',
    //             },
    //             animatedCloseButton: {
    //                 flex: 1,
    //                 justifyContent: 'center',
    //                 alignItems: 'center',
    //             },
    //         }),
    //     [buttonSize, collapse]
    // );


    const animatedStyles = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: posX.value }, { translateY: posY.value }],
        };
    });

    // useEffect(() => {
    //     // initally closebutton is not visible
    //     // during drag closebutton will become visible
    //     if (closeBtnRef && closeBtnRef.current) {
    //         closeBtnRef.current.setNativeProps({
    //             style: {
    //                 opacity: 0,
    //             },
    //         });
    //     }

    //     setTimeout(() => {
    //         setCollapse(true);
    //         // handleDraggableBtnCollapse('start');

    //         setTimer(
    //             setTimeout(() => {
    //                 if (draggableButtonRef && draggableButtonRef.current) {
    //                     // handleDraggableBtnBackground('start');
    //                 }
    //                 if (counterWrapperRef && counterWrapperRef.current) {
    //                     // handleCountButtonBackground('start');
    //                 }
    //             }, blurredBtnDelay)
    //         );
    //     }, hideTextAfterDelay);

    //     return () => {
    //         clearTimeout(timer);
    //     };
    // }, []);

    // const handleOverlapping = callback => {
    //     draggableButtonRef.current.measure(
    //         (_x1, _y1, width1, height1, pageX1, pageY1) => {
    //             if (closeBtnRef && closeBtnRef.current) {
    //                 closeBtnRef.current.measure(
    //                     (_x2, _y2, width2, height2, pageX2, pageY2) => {
    //                         // Compare the positions and dimensions to check for overlap
    //                         const isOverlapping =
    //                             pageX1 < pageX2 + width2 &&
    //                             pageX1 + width1 > pageX2 &&
    //                             pageY1 < pageY2 + height2 &&
    //                             pageY1 + height1 > pageY2;

    //                         if (callback) {
    //                             callback(isOverlapping);
    //                         }
    //                     }
    //                 );
    //             }
    //         }
    //     );
    // };

    // const handleOnPress = () => {
    //     clearTimeout(timer);
    //     // handleCloseBtnTranslateY('start');
    // };

    // const handleOnDrag = () => {
    //     // during drag close button is visible
    //     if (closeBtnRef && closeBtnRef.current) {
    //         closeBtnRef.current.setNativeProps({
    //             style: {
    //                 opacity: 1,
    //             },
    //         });
    //     }


    //     // draggableBtnBackgroundValue.setValue(1);
    //     // countButtonBackgroundValue.setValue(1);

    //     handleOverlapping(isOverlapping => {
    //         if (isOverlapping) {
    //             if (overlappingRef && !overlappingRef.current) {
    //                 overlappingRef.current = true;
    //             }

    //             // overlapping and closeBtnScaleValue animation is not added
    //             if (
    //                 isScaleAnimationAddedRef &&
    //                 !isScaleAnimationAddedRef.current
    //             ) {
    //                 // handleCloseBtnScale('start');
    //                 isScaleAnimationAddedRef.current = true;
    //             }
    //         }
    //         // not overlapping and closeBtnScaleValue animation is added
    //         else if (
    //             isScaleAnimationAddedRef &&
    //             isScaleAnimationAddedRef.current
    //         ) {
    //             // handleCloseBtnScale('stop');
    //             isScaleAnimationAddedRef.current = false;
    //         }

    //         // overlapping and close button transition is not added
    //         if (!isCloseBtnTransitionAddedRef.current) {
    //             // handleCloseBtnTranslateY('start');
    //             isCloseBtnTransitionAddedRef.current = true;
    //         }
    //     });
    // };

    const handleOnRelease = () => {
        // const distanceFromLeft = position.x;
        // const halfDistance = width / 2;
        // overlappingRef.current = false;

        // // snap to left or right
        // if (distanceFromLeft - halfDistance + buttonSize / 2 <= 0) {
        //     // setPosition({
        //     //     ...position,
        //     //     x: 6,
        //     // });

        //     posX.value = 6;

        // } else {
        //     // setPosition({
        //     //     ...position,
        //     //     x: (collapse ? width - buttonSize : width - 200) - 6,
        //     // });

        //     posX.value = (collapse ? width - buttonSize : width - 200) - 6;

        //     if (!collapse) {
        //         // setTimeout(() => {
        //         //     posX.value = 6;
        //         //     // setPosition({
        //         //     //     ...position,
        //         //     //     x: 6,
        //         //     // });
        //         // }, 500);
        //     }
        // }

        // const leftDistance = position.x;
        // const rightDistance = width - distanceFromLeft;
        // const currentButtonSize = width - (collapse ? 50 : 200) - 6;

        // // snap to closest boundary on x-axis (left or right)
        // // snap to closest boundary on y-axis (top or bottom) while considering the boundaryTop and boundaryBottom
        // if (height - position.y <= boundaryBottom) {
        //     posX.value = leftDistance < rightDistance ? 6 : currentButtonSize;
        //     posY.value = height - buttonSize - boundaryBottom;
        // } else if (position.y <= boundaryTop) {
        //     posX.value = leftDistance < rightDistance ? 6 : currentButtonSize;
        //     posY.value = boundaryTop;
        // }

        // setTimer(
        //     setTimeout(() => {
        //         if (draggableButtonRef && draggableButtonRef.current) {
        //             // handleDraggableBtnBackground('start');
        //         }

        //         if (counterWrapperRef && counterWrapperRef.current) {
        //             // handleCountButtonBackground('start');
        //         }
        //     }, blurredBtnDelay)
        // );

        // setTimeout(() => {
        //     if (closeBtnRef && closeBtnRef.current) {
        //         closeBtnRef.current.setNativeProps({
        //             style: {
        //                 opacity: 0,
        //             },
        //         });
        //     }
        // }, 500);

        // animate smooth transition to zero
        // handleCloseBtnTranslateY('stop');

        // when button is released and overlapping then hide draggable button
        // handleOverlapping(isOverlapping => {
        //     if (isOverlapping) {
        //         if (onClose) onClose();
        //         if (draggableButtonRef && draggableButtonRef.current) {
        //             setShowDraggable(false);
        //         }
        //     }
        // });

        // setTimeout(() => {
        //     if (
        //         isCloseBtnTransitionAddedRef &&
        //         isCloseBtnTransitionAddedRef.current
        //     ) {
        //         isCloseBtnTransitionAddedRef.current = false;
        //     }
        // }, 100);

        // clearTimeout(timer);

    };


    const gestureHandler = useAnimatedGestureHandler({
        onStart: (_, ctx: any) => {
            ctx.startX = posX.value;
            ctx.startY = posY.value;
            console.log("start clicked")


            // handleCloseBtnTranslateY('start')
        },
        onActive: (event, ctx) => {
            posX.value = ctx.startX + event.translationX;
            posY.value = ctx.startY + event.translationY;
            console.log("dragging...")

        },
        onEnd: (_) => {

            // console.log({
            //     posX: posX.value,
            //     posY: posY.value,
            // })

            // posX.value = withSpring(0);
            // posY.value = withSpring(0);

            // handleOnRelease();
            console.log("end clicked")
        },
    });

    return (
        <>
            <Box />
        </>
    );
}

DraggableFabButton.propTypes = propTypes;
DraggableFabButton.defaultProps = defaultProps;

export default DraggableFabButton;
