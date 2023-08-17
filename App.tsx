import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedGestureHandler,
    withTiming,
    interpolateColor,
    runOnJS,
} from 'react-native-reanimated';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';


function DraggableFabButton({
    visible = true,
    text,
    onToggleVisibility,
    xPositionValue = 6,
    yPositionValue = 300,
    onPress,
    onDrag,
    onRelease,
    onClose,

    count = 0,
    hideTextAfterDelay = 3000,
    blurredBtnDelay = 2000,
    boundaryTop = 50,
    boundaryBottom = 50,
    closeButtonZIndex,
    draggableButtonZIndex,
}: {
    visible: boolean;
    text?: string;
    onToggleVisibility?: (newVisibility: boolean) => void;
    xPositionValue?: number;
    yPositionValue?: number;
    onPress?: () => void;
    onDrag?: () => void;
    onClose?: () => void;
    onRelease?: () => void;
    count?: number;
    hideTextAfterDelay?: number;
    blurredBtnDelay?: number;
    boundaryTop?: number;
    boundaryBottom?: number;
    closeButtonZIndex?: number;
    draggableButtonZIndex?: number;
}) {
    const { width, height } = useWindowDimensions();
    const posX = useSharedValue(xPositionValue);
    const posY = useSharedValue(yPositionValue);
    const lastDraggedX = useSharedValue(0);
    const lastDraggedY = useSharedValue(0);
    const draggableBtnTranslateY = useSharedValue(0);
    const draggableBtnColor = useSharedValue(1);
    const closeBtnColor = useSharedValue(1);
    const closeBtnScale = useSharedValue(1);
    const isDragging = useSharedValue(false);
    const isOverlapping = useSharedValue(false);
    const [collapsed, setCollapsed] = useState(false);
    const draggableBtnWidth = useSharedValue(200);
    const closeButtonStartX = width / 2 - 25;
    const closeButtonStartY = height - 300;
    const offset = 6;
    const blurAnimationDuration = 300;
    const buttonRadius = 25;

    const onAnimationFinish = () => {
        setTimeout(() => {
            draggableBtnColor.value = withTiming(0, {
                duration: blurAnimationDuration,
            })
            closeBtnColor.value = withTiming(0, {
                duration: blurAnimationDuration,
            })
        }, blurredBtnDelay)
    }

    useEffect(() => {
        draggableBtnColor.value = withTiming(1);
        closeBtnColor.value = withTiming(1);
        setTimeout(() => {
            draggableBtnColor.value = withTiming(0, {
                duration: blurAnimationDuration,
            })
            closeBtnColor.value = withTiming(0, {
                duration: blurAnimationDuration,
            })
        }, blurredBtnDelay)
    }, [visible])

    useEffect(() => {
        setTimeout(() => {
            setCollapsed(true);

            if (!isDragging.value) {
                // reset position to left side or right side
                if (posX.value < width / 2) {
                    posX.value = withTiming(offset);
                } else {
                    posX.value = withTiming(width - draggableBtnWidth.value - offset);
                }

                // when dragging is finished then collapse the button
                draggableBtnWidth.value = withTiming(50, {
                    duration: 300,
                });
            }

        }, hideTextAfterDelay)
    }, []);

    const gestureHandler = useAnimatedGestureHandler({
        onStart: (event, context) => {
            context.startX = posX.value;
            context.startY = posY.value;
            draggableBtnTranslateY.value = withTiming(0);

            onPress && runOnJS(onPress)();
        },
        onActive: (event, context) => {
            posX.value = context.startX + event.translationX;
            posY.value = context.startY + event.translationY;
            isDragging.value = true;


            // boundary check top
            if (posY.value < boundaryTop) {
                posY.value = boundaryTop;
            }

            if (posY.value > height - boundaryBottom - (buttonRadius + buttonRadius)) {
                posY.value = height - boundaryBottom - (buttonRadius + buttonRadius);
            }

            if (posX.value < offset) {
                posX.value = offset;
            }

            if (posX.value > width - draggableBtnWidth.value - offset) {
                posX.value = width - draggableBtnWidth.value - offset;
            }

            // get current position of draggable button and close button
            const draggableButtonStartX = posX.value;
            const draggableButtonStartY = posY.value;

            // get the center of the draggable button and close button
            const draggableButtonCenterX = draggableButtonStartX + buttonRadius;
            const draggableButtonCenterY = draggableButtonStartY + buttonRadius;
            const closeButtonCenterX = closeButtonStartX + buttonRadius;
            const closeButtonCenterY = closeButtonStartY + buttonRadius;
            const distanceX = Math.abs(draggableButtonCenterX - closeButtonCenterX);
            const distanceY = Math.abs(draggableButtonCenterY - closeButtonCenterY);


            // if the distance between the two centers is less than the sum of the radii, then they overlap
            if ((distanceX < (draggableBtnWidth.value / 2) + buttonRadius && distanceY < buttonRadius + buttonRadius)) {
                if (!isOverlapping.value) {
                    isOverlapping.value = true;
                    closeBtnScale.value = withTiming(1.2, {
                        duration: 200,
                    });
                }
            } else {
                isOverlapping.value = false;
                closeBtnScale.value = withTiming(1, {
                    duration: 200,
                });
            }

            draggableBtnColor.value = withTiming(1);
            closeBtnColor.value = withTiming(1);


            onDrag && runOnJS(onDrag)();
        },
        onFinish: (event, context) => {
            lastDraggedX.value = posX.value;
            lastDraggedY.value = posY.value;
            isDragging.value = false;

            const leftDistance = lastDraggedX.value;
            const rightDistance = width - leftDistance;

            closeBtnScale.value = withTiming(1);
            draggableBtnTranslateY.value = withTiming(1);

            if (isOverlapping.value) {
                isOverlapping.value = false;
                onToggleVisibility && runOnJS(onToggleVisibility)(false);
                onClose && runOnJS(onClose)();
            }
            runOnJS(onAnimationFinish)();

            if (!isDragging.value) {
                // when dragging is finished then collapse the button
                draggableBtnWidth.value = withTiming(50, {
                    duration: 200,
                });
            }

            if (leftDistance + (draggableBtnWidth.value / 2) < rightDistance) {
                posX.value = withTiming(offset);
            } else {
                posX.value = withTiming(width - buttonRadius - offset);
            }

            onRelease && runOnJS(onRelease)();
        }
    });

    const draggableButtonAnimatedStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            draggableBtnColor.value,
            [0, 1],
            ["#7fd7cf", "#00afa0"],
        )

        return {
            backgroundColor,
            width: draggableBtnWidth.value,
            transform: [
                {
                    translateX: posX.value,
                },
                {
                    translateY: posY.value,
                },
            ],
        };
    });

    const counterTextAnimatedStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            closeBtnColor.value,
            [0, 1],
            ["#f29788", "#e53012"],
        )
        return {
            backgroundColor,
        };
    });

    const closeButtonAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: draggableBtnTranslateY.value * (height - closeButtonStartY + draggableBtnWidth.value)
                },
                {
                    scale: closeBtnScale.value
                }
            ],
        };
    });

    const styles = useMemo(() => StyleSheet.create({
        box: {
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: 'teal',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
        },
        text: {
            color: 'white',
            marginRight: 8,
            // fontFamily: 'regular',
            // fontWeight: 'bold',
        },
        counterTextWrapper: {
            position: 'absolute',
            top: 0,
            right: 0,
            borderRadius: 10,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: 20,
            height: 20,
        },
        counterText: {
            color: 'white',
            // fontFamily: 'regular',
            // fontWeight: 'bold',
        },
    }), [collapsed])

    return (
        <>
            {visible && (
                <PanGestureHandler
                    onGestureEvent={gestureHandler}
                >
                    <Animated.View style={[styles.box, draggableButtonAnimatedStyle]}>
                        <Animated.View
                            style={[
                                styles.counterTextWrapper,
                                counterTextAnimatedStyle
                            ]}
                        >
                            <Text style={styles.counterText}>
                                {count > 9 ? '9' : count}
                            </Text>
                        </Animated.View>

                        {!collapsed && (
                            <Text style={styles.text}>{text}</Text>
                        )}
                    </Animated.View>
                </PanGestureHandler>
            )}

            <PanGestureHandler >
                <Animated.View
                    style={[
                        {
                            backgroundColor: 'black',
                            opacity: 0.5,
                            position: 'absolute',
                            top: closeButtonStartY,
                            left: closeButtonStartX,
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                        },
                        closeButtonAnimatedStyle
                    ]}
                />
            </PanGestureHandler>
        </>
    );
}


export default function App() {
    const [isVisible, setIsVisible] = useState(true)
    const [counter, setCounter] = useState(0)

    const handleToggleVisibility = (newVisibility: boolean) => {
        setIsVisible(newVisibility);
    }

    const styles = useMemo(() => StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: 'pink',
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
        }
    }), [])

    return (
        <GestureHandlerRootView style={styles.container}>
            <Pressable
                style={{
                    backgroundColor: 'red',
                    position: 'absolute',
                    top: 100,
                    left: 50,
                    zIndex: 100,
                    padding: 10,
                    borderRadius: 10,
                }}
                onPress={() => {
                    setIsVisible(true)
                }}
            >
                <Text>show</Text>
            </Pressable>


            <DraggableFabButton
                visible={isVisible}
                text="Add to compare"
                count={counter}
                onToggleVisibility={handleToggleVisibility}
                onPress={() => {
                    console.log("pressed")
                }}
                onDrag={() => {
                    console.log("dragging")
                }}
                onRelease={() => {
                    console.log("released")
                    setCounter(counter + 1)
                }}
                onClose={() => {
                    console.log("overlapping")
                    setIsVisible(false)
                }}
            />
        </GestureHandlerRootView>
    )
}