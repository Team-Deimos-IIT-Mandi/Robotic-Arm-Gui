
"use strict";

let ApiOptions = require('./ApiOptions.js');
let KortexError = require('./KortexError.js');
let ErrorCodes = require('./ErrorCodes.js');
let SubErrorCodes = require('./SubErrorCodes.js');
let CoggingFeedforwardModeInformation = require('./CoggingFeedforwardModeInformation.js');
let AxisOffsets = require('./AxisOffsets.js');
let CommandMode = require('./CommandMode.js');
let SafetyIdentifierBankA = require('./SafetyIdentifierBankA.js');
let TorqueCalibration = require('./TorqueCalibration.js');
let Servoing = require('./Servoing.js');
let RampResponse = require('./RampResponse.js');
let TorqueOffset = require('./TorqueOffset.js');
let ActuatorConfig_SafetyLimitType = require('./ActuatorConfig_SafetyLimitType.js');
let AxisPosition = require('./AxisPosition.js');
let StepResponse = require('./StepResponse.js');
let CustomDataIndex = require('./CustomDataIndex.js');
let EncoderDerivativeParameters = require('./EncoderDerivativeParameters.js');
let CoggingFeedforwardMode = require('./CoggingFeedforwardMode.js');
let ControlLoopParameters = require('./ControlLoopParameters.js');
let ControlLoopSelection = require('./ControlLoopSelection.js');
let ActuatorConfig_ServiceVersion = require('./ActuatorConfig_ServiceVersion.js');
let FrequencyResponse = require('./FrequencyResponse.js');
let PositionCommand = require('./PositionCommand.js');
let CommandModeInformation = require('./CommandModeInformation.js');
let LoopSelection = require('./LoopSelection.js');
let ActuatorConfig_ControlMode = require('./ActuatorConfig_ControlMode.js');
let ActuatorConfig_ControlModeInformation = require('./ActuatorConfig_ControlModeInformation.js');
let CustomDataSelection = require('./CustomDataSelection.js');
let VectorDriveParameters = require('./VectorDriveParameters.js');
let ControlLoop = require('./ControlLoop.js');
let CommandFlags = require('./CommandFlags.js');
let ActuatorCyclic_Command = require('./ActuatorCyclic_Command.js');
let ActuatorCyclic_CustomData = require('./ActuatorCyclic_CustomData.js');
let ActuatorCyclic_ServiceVersion = require('./ActuatorCyclic_ServiceVersion.js');
let StatusFlags = require('./StatusFlags.js');
let ActuatorCyclic_MessageId = require('./ActuatorCyclic_MessageId.js');
let ActuatorCyclic_Feedback = require('./ActuatorCyclic_Feedback.js');
let SafetyNotificationList = require('./SafetyNotificationList.js');
let BridgeConfig = require('./BridgeConfig.js');
let BridgeStatus = require('./BridgeStatus.js');
let SequenceInfoNotificationList = require('./SequenceInfoNotificationList.js');
let ControllerElementEventType = require('./ControllerElementEventType.js');
let JointLimitation = require('./JointLimitation.js');
let Map = require('./Map.js');
let NetworkHandle = require('./NetworkHandle.js');
let TrajectoryErrorType = require('./TrajectoryErrorType.js');
let JointTrajectoryConstraintType = require('./JointTrajectoryConstraintType.js');
let NetworkNotification = require('./NetworkNotification.js');
let KinematicTrajectoryConstraints = require('./KinematicTrajectoryConstraints.js');
let ConfigurationChangeNotification_configuration_change = require('./ConfigurationChangeNotification_configuration_change.js');
let ZoneShape = require('./ZoneShape.js');
let Base_ControlModeNotification = require('./Base_ControlModeNotification.js');
let TrajectoryErrorElement = require('./TrajectoryErrorElement.js');
let Admittance = require('./Admittance.js');
let WrenchCommand = require('./WrenchCommand.js');
let ControllerNotification_state = require('./ControllerNotification_state.js');
let SequenceTaskHandle = require('./SequenceTaskHandle.js');
let Pose = require('./Pose.js');
let ActionList = require('./ActionList.js');
let ServoingModeNotificationList = require('./ServoingModeNotificationList.js');
let ActionNotificationList = require('./ActionNotificationList.js');
let MapElement = require('./MapElement.js');
let JointTrajectoryConstraint = require('./JointTrajectoryConstraint.js');
let RobotEventNotificationList = require('./RobotEventNotificationList.js');
let ControllerNotification = require('./ControllerNotification.js');
let Base_ControlModeInformation = require('./Base_ControlModeInformation.js');
let JointTorques = require('./JointTorques.js');
let TrajectoryErrorIdentifier = require('./TrajectoryErrorIdentifier.js');
let GripperRequest = require('./GripperRequest.js');
let NetworkNotificationList = require('./NetworkNotificationList.js');
let ConfigurationChangeNotificationList = require('./ConfigurationChangeNotificationList.js');
let Orientation = require('./Orientation.js');
let FactoryNotification = require('./FactoryNotification.js');
let FullIPv4Configuration = require('./FullIPv4Configuration.js');
let TrajectoryContinuityMode = require('./TrajectoryContinuityMode.js');
let FullUserProfile = require('./FullUserProfile.js');
let ServoingMode = require('./ServoingMode.js');
let ProtectionZone = require('./ProtectionZone.js');
let CartesianLimitationList = require('./CartesianLimitationList.js');
let BridgeIdentifier = require('./BridgeIdentifier.js');
let ControllerList = require('./ControllerList.js');
let NavigationDirection = require('./NavigationDirection.js');
let FirmwareComponentVersion = require('./FirmwareComponentVersion.js');
let ControlModeNotificationList = require('./ControlModeNotificationList.js');
let SnapshotType = require('./SnapshotType.js');
let CartesianSpeed = require('./CartesianSpeed.js');
let WifiEnableState = require('./WifiEnableState.js');
let Base_ServiceVersion = require('./Base_ServiceVersion.js');
let Wrench = require('./Wrench.js');
let SequenceInfoNotification = require('./SequenceInfoNotification.js');
let AdvancedSequenceHandle = require('./AdvancedSequenceHandle.js');
let IKData = require('./IKData.js');
let ArmStateInformation = require('./ArmStateInformation.js');
let CartesianTrajectoryConstraint = require('./CartesianTrajectoryConstraint.js');
let Ssid = require('./Ssid.js');
let MappingInfoNotificationList = require('./MappingInfoNotificationList.js');
let BridgePortConfig = require('./BridgePortConfig.js');
let MapEvent = require('./MapEvent.js');
let Waypoint = require('./Waypoint.js');
let OperatingModeInformation = require('./OperatingModeInformation.js');
let Base_Stop = require('./Base_Stop.js');
let MapGroupHandle = require('./MapGroupHandle.js');
let WifiInformationList = require('./WifiInformationList.js');
let GripperMode = require('./GripperMode.js');
let MappingInfoNotification = require('./MappingInfoNotification.js');
let ConstrainedOrientation = require('./ConstrainedOrientation.js');
let ChangeJointSpeeds = require('./ChangeJointSpeeds.js');
let UserNotification = require('./UserNotification.js');
let IPv4Configuration = require('./IPv4Configuration.js');
let ConstrainedPosition = require('./ConstrainedPosition.js');
let SequenceTasksRange = require('./SequenceTasksRange.js');
let TransformationMatrix = require('./TransformationMatrix.js');
let MapGroupList = require('./MapGroupList.js');
let RequestedActionType = require('./RequestedActionType.js');
let ControllerHandle = require('./ControllerHandle.js');
let Finger = require('./Finger.js');
let WaypointValidationReport = require('./WaypointValidationReport.js');
let CartesianLimitation = require('./CartesianLimitation.js');
let ControllerConfigurationMode = require('./ControllerConfigurationMode.js');
let ControllerEvent = require('./ControllerEvent.js');
let UserProfileList = require('./UserProfileList.js');
let ActivateMapHandle = require('./ActivateMapHandle.js');
let OperatingModeNotification = require('./OperatingModeNotification.js');
let WifiConfigurationList = require('./WifiConfigurationList.js');
let ActionType = require('./ActionType.js');
let LimitationType = require('./LimitationType.js');
let WifiConfiguration = require('./WifiConfiguration.js');
let MapGroup = require('./MapGroup.js');
let LedState = require('./LedState.js');
let ConfigurationChangeNotification = require('./ConfigurationChangeNotification.js');
let JointsLimitationsList = require('./JointsLimitationsList.js');
let ControllerNotificationList = require('./ControllerNotificationList.js');
let ControllerType = require('./ControllerType.js');
let SignalQuality = require('./SignalQuality.js');
let BridgeResult = require('./BridgeResult.js');
let MapEvent_events = require('./MapEvent_events.js');
let GpioBehavior = require('./GpioBehavior.js');
let ChangeWrench = require('./ChangeWrench.js');
let Snapshot = require('./Snapshot.js');
let JointAngles = require('./JointAngles.js');
let Waypoint_type_of_waypoint = require('./Waypoint_type_of_waypoint.js');
let Base_SafetyIdentifier = require('./Base_SafetyIdentifier.js');
let GpioPinConfiguration = require('./GpioPinConfiguration.js');
let WristDigitalInputIdentifier = require('./WristDigitalInputIdentifier.js');
let SequenceHandle = require('./SequenceHandle.js');
let Base_RotationMatrixRow = require('./Base_RotationMatrixRow.js');
let Base_Position = require('./Base_Position.js');
let RobotEventNotification = require('./RobotEventNotification.js');
let ActionExecutionState = require('./ActionExecutionState.js');
let MappingHandle = require('./MappingHandle.js');
let Delay = require('./Delay.js');
let ServoingModeNotification = require('./ServoingModeNotification.js');
let EmergencyStop = require('./EmergencyStop.js');
let FirmwareBundleVersions = require('./FirmwareBundleVersions.js');
let UserProfile = require('./UserProfile.js');
let GpioCommand = require('./GpioCommand.js');
let ConstrainedJointAngle = require('./ConstrainedJointAngle.js');
let CommunicationInterfaceConfiguration = require('./CommunicationInterfaceConfiguration.js');
let Timeout = require('./Timeout.js');
let WifiEncryptionType = require('./WifiEncryptionType.js');
let ControllerConfigurationList = require('./ControllerConfigurationList.js');
let AdmittanceMode = require('./AdmittanceMode.js');
let Action = require('./Action.js');
let Sequence = require('./Sequence.js');
let PasswordChange = require('./PasswordChange.js');
let TrajectoryErrorReport = require('./TrajectoryErrorReport.js');
let CartesianTrajectoryConstraint_type = require('./CartesianTrajectoryConstraint_type.js');
let ControllerElementHandle_identifier = require('./ControllerElementHandle_identifier.js');
let JointAngle = require('./JointAngle.js');
let RFConfiguration = require('./RFConfiguration.js');
let ActionHandle = require('./ActionHandle.js');
let Twist = require('./Twist.js');
let JointSpeed = require('./JointSpeed.js');
let IPv4Information = require('./IPv4Information.js');
let GpioAction = require('./GpioAction.js');
let MapList = require('./MapList.js');
let SequenceTasksConfiguration = require('./SequenceTasksConfiguration.js');
let SafetyEvent = require('./SafetyEvent.js');
let ControllerInputType = require('./ControllerInputType.js');
let ServoingModeInformation = require('./ServoingModeInformation.js');
let Base_JointSpeeds = require('./Base_JointSpeeds.js');
let ProtectionZoneHandle = require('./ProtectionZoneHandle.js');
let CartesianWaypoint = require('./CartesianWaypoint.js');
let UserNotificationList = require('./UserNotificationList.js');
let EventIdSequenceInfoNotification = require('./EventIdSequenceInfoNotification.js');
let Base_RotationMatrix = require('./Base_RotationMatrix.js');
let ConfigurationNotificationEvent = require('./ConfigurationNotificationEvent.js');
let TrajectoryInfo = require('./TrajectoryInfo.js');
let Xbox360DigitalInputIdentifier = require('./Xbox360DigitalInputIdentifier.js');
let Query = require('./Query.js');
let Xbox360AnalogInputIdentifier = require('./Xbox360AnalogInputIdentifier.js');
let Base_GpioConfiguration = require('./Base_GpioConfiguration.js');
let ConstrainedPose = require('./ConstrainedPose.js');
let ConstrainedJointAngles = require('./ConstrainedJointAngles.js');
let RobotEvent = require('./RobotEvent.js');
let SequenceTasks = require('./SequenceTasks.js');
let BridgeType = require('./BridgeType.js');
let ActionNotification = require('./ActionNotification.js');
let WrenchMode = require('./WrenchMode.js');
let TwistCommand = require('./TwistCommand.js');
let Base_CapSenseConfig = require('./Base_CapSenseConfig.js');
let GpioPinPropertyFlags = require('./GpioPinPropertyFlags.js');
let Base_CapSenseMode = require('./Base_CapSenseMode.js');
let ControllerElementState = require('./ControllerElementState.js');
let Action_action_parameters = require('./Action_action_parameters.js');
let ActionEvent = require('./ActionEvent.js');
let TransformationRow = require('./TransformationRow.js');
let SequenceTaskConfiguration = require('./SequenceTaskConfiguration.js');
let GripperCommand = require('./GripperCommand.js');
let OperatingMode = require('./OperatingMode.js');
let ControllerElementHandle = require('./ControllerElementHandle.js');
let NetworkType = require('./NetworkType.js');
let NetworkEvent = require('./NetworkEvent.js');
let FactoryEvent = require('./FactoryEvent.js');
let ControllerState = require('./ControllerState.js');
let ActuatorInformation = require('./ActuatorInformation.js');
let ArmStateNotification = require('./ArmStateNotification.js');
let AngularWaypoint = require('./AngularWaypoint.js');
let BridgeList = require('./BridgeList.js');
let OperatingModeNotificationList = require('./OperatingModeNotificationList.js');
let SoundType = require('./SoundType.js');
let ProtectionZoneInformation = require('./ProtectionZoneInformation.js');
let Point = require('./Point.js');
let ProtectionZoneList = require('./ProtectionZoneList.js');
let SystemTime = require('./SystemTime.js');
let PreComputedJointTrajectory = require('./PreComputedJointTrajectory.js');
let ControllerEventType = require('./ControllerEventType.js');
let PreComputedJointTrajectoryElement = require('./PreComputedJointTrajectoryElement.js');
let ProtectionZoneNotification = require('./ProtectionZoneNotification.js');
let AppendActionInformation = require('./AppendActionInformation.js');
let Faults = require('./Faults.js');
let BluetoothEnableState = require('./BluetoothEnableState.js');
let UserEvent = require('./UserEvent.js');
let UserList = require('./UserList.js');
let GpioConfigurationList = require('./GpioConfigurationList.js');
let SwitchControlMapping = require('./SwitchControlMapping.js');
let GpioEvent = require('./GpioEvent.js');
let MapHandle = require('./MapHandle.js');
let JointNavigationDirection = require('./JointNavigationDirection.js');
let SequenceTask = require('./SequenceTask.js');
let BackupEvent = require('./BackupEvent.js');
let JointTorque = require('./JointTorque.js');
let SequenceTasksPair = require('./SequenceTasksPair.js');
let SequenceList = require('./SequenceList.js');
let ChangeTwist = require('./ChangeTwist.js');
let ProtectionZoneEvent = require('./ProtectionZoneEvent.js');
let ControllerConfiguration = require('./ControllerConfiguration.js');
let WaypointList = require('./WaypointList.js');
let Gripper = require('./Gripper.js');
let Base_ControlMode = require('./Base_ControlMode.js');
let ShapeType = require('./ShapeType.js');
let Mapping = require('./Mapping.js');
let WifiInformation = require('./WifiInformation.js');
let TrajectoryInfoType = require('./TrajectoryInfoType.js');
let TwistLimitation = require('./TwistLimitation.js');
let Gen3GpioPinId = require('./Gen3GpioPinId.js');
let SequenceInformation = require('./SequenceInformation.js');
let ControllerBehavior = require('./ControllerBehavior.js');
let WrenchLimitation = require('./WrenchLimitation.js');
let ProtectionZoneNotificationList = require('./ProtectionZoneNotificationList.js');
let WifiSecurityType = require('./WifiSecurityType.js');
let MappingList = require('./MappingList.js');
let BaseFeedback = require('./BaseFeedback.js');
let BaseCyclic_Command = require('./BaseCyclic_Command.js');
let BaseCyclic_Feedback = require('./BaseCyclic_Feedback.js');
let ActuatorCustomData = require('./ActuatorCustomData.js');
let BaseCyclic_ServiceVersion = require('./BaseCyclic_ServiceVersion.js');
let ActuatorFeedback = require('./ActuatorFeedback.js');
let ActuatorCommand = require('./ActuatorCommand.js');
let BaseCyclic_CustomData = require('./BaseCyclic_CustomData.js');
let UARTParity = require('./UARTParity.js');
let NotificationType = require('./NotificationType.js');
let Unit = require('./Unit.js');
let UARTSpeed = require('./UARTSpeed.js');
let SafetyHandle = require('./SafetyHandle.js');
let UARTWordLength = require('./UARTWordLength.js');
let NotificationOptions = require('./NotificationOptions.js');
let UARTConfiguration = require('./UARTConfiguration.js');
let CartesianReferenceFrame = require('./CartesianReferenceFrame.js');
let ArmState = require('./ArmState.js');
let SafetyStatusValue = require('./SafetyStatusValue.js');
let UserProfileHandle = require('./UserProfileHandle.js');
let SafetyNotification = require('./SafetyNotification.js');
let UARTStopBits = require('./UARTStopBits.js');
let CountryCodeIdentifier = require('./CountryCodeIdentifier.js');
let Timestamp = require('./Timestamp.js');
let UARTDeviceIdentification = require('./UARTDeviceIdentification.js');
let Empty = require('./Empty.js');
let CountryCode = require('./CountryCode.js');
let NotificationHandle = require('./NotificationHandle.js');
let DeviceTypes = require('./DeviceTypes.js');
let DeviceHandle = require('./DeviceHandle.js');
let Permission = require('./Permission.js');
let Connection = require('./Connection.js');
let ControlConfig_ControlModeInformation = require('./ControlConfig_ControlModeInformation.js');
let ControlConfig_ControlMode = require('./ControlConfig_ControlMode.js');
let CartesianReferenceFrameInfo = require('./CartesianReferenceFrameInfo.js');
let PayloadInformation = require('./PayloadInformation.js');
let JointSpeedSoftLimits = require('./JointSpeedSoftLimits.js');
let DesiredSpeeds = require('./DesiredSpeeds.js');
let ControlConfigurationEvent = require('./ControlConfigurationEvent.js');
let JointAccelerationSoftLimits = require('./JointAccelerationSoftLimits.js');
let ControlConfig_JointSpeeds = require('./ControlConfig_JointSpeeds.js');
let LinearTwist = require('./LinearTwist.js');
let GravityVector = require('./GravityVector.js');
let ControlConfigurationNotification = require('./ControlConfigurationNotification.js');
let KinematicLimits = require('./KinematicLimits.js');
let ToolConfiguration = require('./ToolConfiguration.js');
let ControlConfig_ControlModeNotification = require('./ControlConfig_ControlModeNotification.js');
let AngularTwist = require('./AngularTwist.js');
let TwistAngularSoftLimit = require('./TwistAngularSoftLimit.js');
let ControlConfig_ServiceVersion = require('./ControlConfig_ServiceVersion.js');
let CartesianTransform = require('./CartesianTransform.js');
let ControlConfig_Position = require('./ControlConfig_Position.js');
let TwistLinearSoftLimit = require('./TwistLinearSoftLimit.js');
let KinematicLimitsList = require('./KinematicLimitsList.js');
let SafetyStatus = require('./SafetyStatus.js');
let CalibrationStatus = require('./CalibrationStatus.js');
let CalibrationItem = require('./CalibrationItem.js');
let IPv4Settings = require('./IPv4Settings.js');
let PowerOnSelfTestResult = require('./PowerOnSelfTestResult.js');
let RunMode = require('./RunMode.js');
let ModelNumber = require('./ModelNumber.js');
let SafetyInformationList = require('./SafetyInformationList.js');
let PartNumberRevision = require('./PartNumberRevision.js');
let DeviceType = require('./DeviceType.js');
let CalibrationResult = require('./CalibrationResult.js');
let DeviceConfig_CapSenseMode = require('./DeviceConfig_CapSenseMode.js');
let CalibrationParameter_value = require('./CalibrationParameter_value.js');
let SafetyThreshold = require('./SafetyThreshold.js');
let SafetyConfigurationList = require('./SafetyConfigurationList.js');
let DeviceConfig_SafetyLimitType = require('./DeviceConfig_SafetyLimitType.js');
let FirmwareVersion = require('./FirmwareVersion.js');
let MACAddress = require('./MACAddress.js');
let PartNumber = require('./PartNumber.js');
let DeviceConfig_CapSenseConfig = require('./DeviceConfig_CapSenseConfig.js');
let SafetyEnable = require('./SafetyEnable.js');
let RebootRqst = require('./RebootRqst.js');
let CalibrationElement = require('./CalibrationElement.js');
let SerialNumber = require('./SerialNumber.js');
let SafetyConfiguration = require('./SafetyConfiguration.js');
let DeviceConfig_ServiceVersion = require('./DeviceConfig_ServiceVersion.js');
let BootloaderVersion = require('./BootloaderVersion.js');
let SafetyInformation = require('./SafetyInformation.js');
let CalibrationParameter = require('./CalibrationParameter.js');
let RunModes = require('./RunModes.js');
let Calibration = require('./Calibration.js');
let CapSenseRegister = require('./CapSenseRegister.js');
let DeviceManager_ServiceVersion = require('./DeviceManager_ServiceVersion.js');
let DeviceHandles = require('./DeviceHandles.js');
let GripperConfig_SafetyIdentifier = require('./GripperConfig_SafetyIdentifier.js');
let RobotiqGripperStatusFlags = require('./RobotiqGripperStatusFlags.js');
let GripperCyclic_Feedback = require('./GripperCyclic_Feedback.js');
let GripperCyclic_Command = require('./GripperCyclic_Command.js');
let MotorFeedback = require('./MotorFeedback.js');
let GripperCyclic_CustomData = require('./GripperCyclic_CustomData.js');
let GripperCyclic_MessageId = require('./GripperCyclic_MessageId.js');
let GripperCyclic_ServiceVersion = require('./GripperCyclic_ServiceVersion.js');
let MotorCommand = require('./MotorCommand.js');
let CustomDataUnit = require('./CustomDataUnit.js');
let I2CReadParameter = require('./I2CReadParameter.js');
let I2CWriteRegisterParameter = require('./I2CWriteRegisterParameter.js');
let EthernetSpeed = require('./EthernetSpeed.js');
let GPIOIdentification = require('./GPIOIdentification.js');
let EthernetDuplex = require('./EthernetDuplex.js');
let I2CReadRegisterParameter = require('./I2CReadRegisterParameter.js');
let GPIOMode = require('./GPIOMode.js');
let EthernetConfiguration = require('./EthernetConfiguration.js');
let EthernetDevice = require('./EthernetDevice.js');
let GPIOValue = require('./GPIOValue.js');
let UARTPortId = require('./UARTPortId.js');
let I2CData = require('./I2CData.js');
let EthernetDeviceIdentification = require('./EthernetDeviceIdentification.js');
let InterconnectConfig_GPIOConfiguration = require('./InterconnectConfig_GPIOConfiguration.js');
let I2CRegisterAddressSize = require('./I2CRegisterAddressSize.js');
let I2CDeviceIdentification = require('./I2CDeviceIdentification.js');
let I2CDeviceAddressing = require('./I2CDeviceAddressing.js');
let I2CMode = require('./I2CMode.js');
let GPIOPull = require('./GPIOPull.js');
let I2CWriteParameter = require('./I2CWriteParameter.js');
let I2CConfiguration = require('./I2CConfiguration.js');
let InterconnectConfig_SafetyIdentifier = require('./InterconnectConfig_SafetyIdentifier.js');
let I2CDevice = require('./I2CDevice.js');
let GPIOIdentifier = require('./GPIOIdentifier.js');
let InterconnectConfig_ServiceVersion = require('./InterconnectConfig_ServiceVersion.js');
let GPIOState = require('./GPIOState.js');
let InterconnectCyclic_Feedback_tool_feedback = require('./InterconnectCyclic_Feedback_tool_feedback.js');
let InterconnectCyclic_Command_tool_command = require('./InterconnectCyclic_Command_tool_command.js');
let InterconnectCyclic_MessageId = require('./InterconnectCyclic_MessageId.js');
let InterconnectCyclic_CustomData = require('./InterconnectCyclic_CustomData.js');
let InterconnectCyclic_Feedback = require('./InterconnectCyclic_Feedback.js');
let InterconnectCyclic_CustomData_tool_customData = require('./InterconnectCyclic_CustomData_tool_customData.js');
let InterconnectCyclic_Command = require('./InterconnectCyclic_Command.js');
let InterconnectCyclic_ServiceVersion = require('./InterconnectCyclic_ServiceVersion.js');
let VisionModuleType = require('./VisionModuleType.js');
let EndEffectorType = require('./EndEffectorType.js');
let BrakeType = require('./BrakeType.js');
let BaseType = require('./BaseType.js');
let WristType = require('./WristType.js');
let InterfaceModuleType = require('./InterfaceModuleType.js');
let ProductConfigurationEndEffectorType = require('./ProductConfigurationEndEffectorType.js');
let ArmLaterality = require('./ArmLaterality.js');
let CompleteProductConfiguration = require('./CompleteProductConfiguration.js');
let ModelId = require('./ModelId.js');
let BitRate = require('./BitRate.js');
let VisionEvent = require('./VisionEvent.js');
let Sensor = require('./Sensor.js');
let TranslationVector = require('./TranslationVector.js');
let SensorSettings = require('./SensorSettings.js');
let VisionConfig_ServiceVersion = require('./VisionConfig_ServiceVersion.js');
let SensorFocusAction = require('./SensorFocusAction.js');
let FocusPoint = require('./FocusPoint.js');
let DistortionCoefficients = require('./DistortionCoefficients.js');
let ExtrinsicParameters = require('./ExtrinsicParameters.js');
let Option = require('./Option.js');
let OptionInformation = require('./OptionInformation.js');
let VisionConfig_RotationMatrix = require('./VisionConfig_RotationMatrix.js');
let VisionNotification = require('./VisionNotification.js');
let Resolution = require('./Resolution.js');
let SensorIdentifier = require('./SensorIdentifier.js');
let VisionConfig_RotationMatrixRow = require('./VisionConfig_RotationMatrixRow.js');
let OptionValue = require('./OptionValue.js');
let IntrinsicProfileIdentifier = require('./IntrinsicProfileIdentifier.js');
let FrameRate = require('./FrameRate.js');
let FocusAction = require('./FocusAction.js');
let ManualFocus = require('./ManualFocus.js');
let SensorFocusAction_action_parameters = require('./SensorFocusAction_action_parameters.js');
let OptionIdentifier = require('./OptionIdentifier.js');
let IntrinsicParameters = require('./IntrinsicParameters.js');
let FollowCartesianTrajectoryAction = require('./FollowCartesianTrajectoryAction.js');
let FollowCartesianTrajectoryResult = require('./FollowCartesianTrajectoryResult.js');
let FollowCartesianTrajectoryActionFeedback = require('./FollowCartesianTrajectoryActionFeedback.js');
let FollowCartesianTrajectoryActionResult = require('./FollowCartesianTrajectoryActionResult.js');
let FollowCartesianTrajectoryActionGoal = require('./FollowCartesianTrajectoryActionGoal.js');
let FollowCartesianTrajectoryGoal = require('./FollowCartesianTrajectoryGoal.js');
let FollowCartesianTrajectoryFeedback = require('./FollowCartesianTrajectoryFeedback.js');

module.exports = {
  ApiOptions: ApiOptions,
  KortexError: KortexError,
  ErrorCodes: ErrorCodes,
  SubErrorCodes: SubErrorCodes,
  CoggingFeedforwardModeInformation: CoggingFeedforwardModeInformation,
  AxisOffsets: AxisOffsets,
  CommandMode: CommandMode,
  SafetyIdentifierBankA: SafetyIdentifierBankA,
  TorqueCalibration: TorqueCalibration,
  Servoing: Servoing,
  RampResponse: RampResponse,
  TorqueOffset: TorqueOffset,
  ActuatorConfig_SafetyLimitType: ActuatorConfig_SafetyLimitType,
  AxisPosition: AxisPosition,
  StepResponse: StepResponse,
  CustomDataIndex: CustomDataIndex,
  EncoderDerivativeParameters: EncoderDerivativeParameters,
  CoggingFeedforwardMode: CoggingFeedforwardMode,
  ControlLoopParameters: ControlLoopParameters,
  ControlLoopSelection: ControlLoopSelection,
  ActuatorConfig_ServiceVersion: ActuatorConfig_ServiceVersion,
  FrequencyResponse: FrequencyResponse,
  PositionCommand: PositionCommand,
  CommandModeInformation: CommandModeInformation,
  LoopSelection: LoopSelection,
  ActuatorConfig_ControlMode: ActuatorConfig_ControlMode,
  ActuatorConfig_ControlModeInformation: ActuatorConfig_ControlModeInformation,
  CustomDataSelection: CustomDataSelection,
  VectorDriveParameters: VectorDriveParameters,
  ControlLoop: ControlLoop,
  CommandFlags: CommandFlags,
  ActuatorCyclic_Command: ActuatorCyclic_Command,
  ActuatorCyclic_CustomData: ActuatorCyclic_CustomData,
  ActuatorCyclic_ServiceVersion: ActuatorCyclic_ServiceVersion,
  StatusFlags: StatusFlags,
  ActuatorCyclic_MessageId: ActuatorCyclic_MessageId,
  ActuatorCyclic_Feedback: ActuatorCyclic_Feedback,
  SafetyNotificationList: SafetyNotificationList,
  BridgeConfig: BridgeConfig,
  BridgeStatus: BridgeStatus,
  SequenceInfoNotificationList: SequenceInfoNotificationList,
  ControllerElementEventType: ControllerElementEventType,
  JointLimitation: JointLimitation,
  Map: Map,
  NetworkHandle: NetworkHandle,
  TrajectoryErrorType: TrajectoryErrorType,
  JointTrajectoryConstraintType: JointTrajectoryConstraintType,
  NetworkNotification: NetworkNotification,
  KinematicTrajectoryConstraints: KinematicTrajectoryConstraints,
  ConfigurationChangeNotification_configuration_change: ConfigurationChangeNotification_configuration_change,
  ZoneShape: ZoneShape,
  Base_ControlModeNotification: Base_ControlModeNotification,
  TrajectoryErrorElement: TrajectoryErrorElement,
  Admittance: Admittance,
  WrenchCommand: WrenchCommand,
  ControllerNotification_state: ControllerNotification_state,
  SequenceTaskHandle: SequenceTaskHandle,
  Pose: Pose,
  ActionList: ActionList,
  ServoingModeNotificationList: ServoingModeNotificationList,
  ActionNotificationList: ActionNotificationList,
  MapElement: MapElement,
  JointTrajectoryConstraint: JointTrajectoryConstraint,
  RobotEventNotificationList: RobotEventNotificationList,
  ControllerNotification: ControllerNotification,
  Base_ControlModeInformation: Base_ControlModeInformation,
  JointTorques: JointTorques,
  TrajectoryErrorIdentifier: TrajectoryErrorIdentifier,
  GripperRequest: GripperRequest,
  NetworkNotificationList: NetworkNotificationList,
  ConfigurationChangeNotificationList: ConfigurationChangeNotificationList,
  Orientation: Orientation,
  FactoryNotification: FactoryNotification,
  FullIPv4Configuration: FullIPv4Configuration,
  TrajectoryContinuityMode: TrajectoryContinuityMode,
  FullUserProfile: FullUserProfile,
  ServoingMode: ServoingMode,
  ProtectionZone: ProtectionZone,
  CartesianLimitationList: CartesianLimitationList,
  BridgeIdentifier: BridgeIdentifier,
  ControllerList: ControllerList,
  NavigationDirection: NavigationDirection,
  FirmwareComponentVersion: FirmwareComponentVersion,
  ControlModeNotificationList: ControlModeNotificationList,
  SnapshotType: SnapshotType,
  CartesianSpeed: CartesianSpeed,
  WifiEnableState: WifiEnableState,
  Base_ServiceVersion: Base_ServiceVersion,
  Wrench: Wrench,
  SequenceInfoNotification: SequenceInfoNotification,
  AdvancedSequenceHandle: AdvancedSequenceHandle,
  IKData: IKData,
  ArmStateInformation: ArmStateInformation,
  CartesianTrajectoryConstraint: CartesianTrajectoryConstraint,
  Ssid: Ssid,
  MappingInfoNotificationList: MappingInfoNotificationList,
  BridgePortConfig: BridgePortConfig,
  MapEvent: MapEvent,
  Waypoint: Waypoint,
  OperatingModeInformation: OperatingModeInformation,
  Base_Stop: Base_Stop,
  MapGroupHandle: MapGroupHandle,
  WifiInformationList: WifiInformationList,
  GripperMode: GripperMode,
  MappingInfoNotification: MappingInfoNotification,
  ConstrainedOrientation: ConstrainedOrientation,
  ChangeJointSpeeds: ChangeJointSpeeds,
  UserNotification: UserNotification,
  IPv4Configuration: IPv4Configuration,
  ConstrainedPosition: ConstrainedPosition,
  SequenceTasksRange: SequenceTasksRange,
  TransformationMatrix: TransformationMatrix,
  MapGroupList: MapGroupList,
  RequestedActionType: RequestedActionType,
  ControllerHandle: ControllerHandle,
  Finger: Finger,
  WaypointValidationReport: WaypointValidationReport,
  CartesianLimitation: CartesianLimitation,
  ControllerConfigurationMode: ControllerConfigurationMode,
  ControllerEvent: ControllerEvent,
  UserProfileList: UserProfileList,
  ActivateMapHandle: ActivateMapHandle,
  OperatingModeNotification: OperatingModeNotification,
  WifiConfigurationList: WifiConfigurationList,
  ActionType: ActionType,
  LimitationType: LimitationType,
  WifiConfiguration: WifiConfiguration,
  MapGroup: MapGroup,
  LedState: LedState,
  ConfigurationChangeNotification: ConfigurationChangeNotification,
  JointsLimitationsList: JointsLimitationsList,
  ControllerNotificationList: ControllerNotificationList,
  ControllerType: ControllerType,
  SignalQuality: SignalQuality,
  BridgeResult: BridgeResult,
  MapEvent_events: MapEvent_events,
  GpioBehavior: GpioBehavior,
  ChangeWrench: ChangeWrench,
  Snapshot: Snapshot,
  JointAngles: JointAngles,
  Waypoint_type_of_waypoint: Waypoint_type_of_waypoint,
  Base_SafetyIdentifier: Base_SafetyIdentifier,
  GpioPinConfiguration: GpioPinConfiguration,
  WristDigitalInputIdentifier: WristDigitalInputIdentifier,
  SequenceHandle: SequenceHandle,
  Base_RotationMatrixRow: Base_RotationMatrixRow,
  Base_Position: Base_Position,
  RobotEventNotification: RobotEventNotification,
  ActionExecutionState: ActionExecutionState,
  MappingHandle: MappingHandle,
  Delay: Delay,
  ServoingModeNotification: ServoingModeNotification,
  EmergencyStop: EmergencyStop,
  FirmwareBundleVersions: FirmwareBundleVersions,
  UserProfile: UserProfile,
  GpioCommand: GpioCommand,
  ConstrainedJointAngle: ConstrainedJointAngle,
  CommunicationInterfaceConfiguration: CommunicationInterfaceConfiguration,
  Timeout: Timeout,
  WifiEncryptionType: WifiEncryptionType,
  ControllerConfigurationList: ControllerConfigurationList,
  AdmittanceMode: AdmittanceMode,
  Action: Action,
  Sequence: Sequence,
  PasswordChange: PasswordChange,
  TrajectoryErrorReport: TrajectoryErrorReport,
  CartesianTrajectoryConstraint_type: CartesianTrajectoryConstraint_type,
  ControllerElementHandle_identifier: ControllerElementHandle_identifier,
  JointAngle: JointAngle,
  RFConfiguration: RFConfiguration,
  ActionHandle: ActionHandle,
  Twist: Twist,
  JointSpeed: JointSpeed,
  IPv4Information: IPv4Information,
  GpioAction: GpioAction,
  MapList: MapList,
  SequenceTasksConfiguration: SequenceTasksConfiguration,
  SafetyEvent: SafetyEvent,
  ControllerInputType: ControllerInputType,
  ServoingModeInformation: ServoingModeInformation,
  Base_JointSpeeds: Base_JointSpeeds,
  ProtectionZoneHandle: ProtectionZoneHandle,
  CartesianWaypoint: CartesianWaypoint,
  UserNotificationList: UserNotificationList,
  EventIdSequenceInfoNotification: EventIdSequenceInfoNotification,
  Base_RotationMatrix: Base_RotationMatrix,
  ConfigurationNotificationEvent: ConfigurationNotificationEvent,
  TrajectoryInfo: TrajectoryInfo,
  Xbox360DigitalInputIdentifier: Xbox360DigitalInputIdentifier,
  Query: Query,
  Xbox360AnalogInputIdentifier: Xbox360AnalogInputIdentifier,
  Base_GpioConfiguration: Base_GpioConfiguration,
  ConstrainedPose: ConstrainedPose,
  ConstrainedJointAngles: ConstrainedJointAngles,
  RobotEvent: RobotEvent,
  SequenceTasks: SequenceTasks,
  BridgeType: BridgeType,
  ActionNotification: ActionNotification,
  WrenchMode: WrenchMode,
  TwistCommand: TwistCommand,
  Base_CapSenseConfig: Base_CapSenseConfig,
  GpioPinPropertyFlags: GpioPinPropertyFlags,
  Base_CapSenseMode: Base_CapSenseMode,
  ControllerElementState: ControllerElementState,
  Action_action_parameters: Action_action_parameters,
  ActionEvent: ActionEvent,
  TransformationRow: TransformationRow,
  SequenceTaskConfiguration: SequenceTaskConfiguration,
  GripperCommand: GripperCommand,
  OperatingMode: OperatingMode,
  ControllerElementHandle: ControllerElementHandle,
  NetworkType: NetworkType,
  NetworkEvent: NetworkEvent,
  FactoryEvent: FactoryEvent,
  ControllerState: ControllerState,
  ActuatorInformation: ActuatorInformation,
  ArmStateNotification: ArmStateNotification,
  AngularWaypoint: AngularWaypoint,
  BridgeList: BridgeList,
  OperatingModeNotificationList: OperatingModeNotificationList,
  SoundType: SoundType,
  ProtectionZoneInformation: ProtectionZoneInformation,
  Point: Point,
  ProtectionZoneList: ProtectionZoneList,
  SystemTime: SystemTime,
  PreComputedJointTrajectory: PreComputedJointTrajectory,
  ControllerEventType: ControllerEventType,
  PreComputedJointTrajectoryElement: PreComputedJointTrajectoryElement,
  ProtectionZoneNotification: ProtectionZoneNotification,
  AppendActionInformation: AppendActionInformation,
  Faults: Faults,
  BluetoothEnableState: BluetoothEnableState,
  UserEvent: UserEvent,
  UserList: UserList,
  GpioConfigurationList: GpioConfigurationList,
  SwitchControlMapping: SwitchControlMapping,
  GpioEvent: GpioEvent,
  MapHandle: MapHandle,
  JointNavigationDirection: JointNavigationDirection,
  SequenceTask: SequenceTask,
  BackupEvent: BackupEvent,
  JointTorque: JointTorque,
  SequenceTasksPair: SequenceTasksPair,
  SequenceList: SequenceList,
  ChangeTwist: ChangeTwist,
  ProtectionZoneEvent: ProtectionZoneEvent,
  ControllerConfiguration: ControllerConfiguration,
  WaypointList: WaypointList,
  Gripper: Gripper,
  Base_ControlMode: Base_ControlMode,
  ShapeType: ShapeType,
  Mapping: Mapping,
  WifiInformation: WifiInformation,
  TrajectoryInfoType: TrajectoryInfoType,
  TwistLimitation: TwistLimitation,
  Gen3GpioPinId: Gen3GpioPinId,
  SequenceInformation: SequenceInformation,
  ControllerBehavior: ControllerBehavior,
  WrenchLimitation: WrenchLimitation,
  ProtectionZoneNotificationList: ProtectionZoneNotificationList,
  WifiSecurityType: WifiSecurityType,
  MappingList: MappingList,
  BaseFeedback: BaseFeedback,
  BaseCyclic_Command: BaseCyclic_Command,
  BaseCyclic_Feedback: BaseCyclic_Feedback,
  ActuatorCustomData: ActuatorCustomData,
  BaseCyclic_ServiceVersion: BaseCyclic_ServiceVersion,
  ActuatorFeedback: ActuatorFeedback,
  ActuatorCommand: ActuatorCommand,
  BaseCyclic_CustomData: BaseCyclic_CustomData,
  UARTParity: UARTParity,
  NotificationType: NotificationType,
  Unit: Unit,
  UARTSpeed: UARTSpeed,
  SafetyHandle: SafetyHandle,
  UARTWordLength: UARTWordLength,
  NotificationOptions: NotificationOptions,
  UARTConfiguration: UARTConfiguration,
  CartesianReferenceFrame: CartesianReferenceFrame,
  ArmState: ArmState,
  SafetyStatusValue: SafetyStatusValue,
  UserProfileHandle: UserProfileHandle,
  SafetyNotification: SafetyNotification,
  UARTStopBits: UARTStopBits,
  CountryCodeIdentifier: CountryCodeIdentifier,
  Timestamp: Timestamp,
  UARTDeviceIdentification: UARTDeviceIdentification,
  Empty: Empty,
  CountryCode: CountryCode,
  NotificationHandle: NotificationHandle,
  DeviceTypes: DeviceTypes,
  DeviceHandle: DeviceHandle,
  Permission: Permission,
  Connection: Connection,
  ControlConfig_ControlModeInformation: ControlConfig_ControlModeInformation,
  ControlConfig_ControlMode: ControlConfig_ControlMode,
  CartesianReferenceFrameInfo: CartesianReferenceFrameInfo,
  PayloadInformation: PayloadInformation,
  JointSpeedSoftLimits: JointSpeedSoftLimits,
  DesiredSpeeds: DesiredSpeeds,
  ControlConfigurationEvent: ControlConfigurationEvent,
  JointAccelerationSoftLimits: JointAccelerationSoftLimits,
  ControlConfig_JointSpeeds: ControlConfig_JointSpeeds,
  LinearTwist: LinearTwist,
  GravityVector: GravityVector,
  ControlConfigurationNotification: ControlConfigurationNotification,
  KinematicLimits: KinematicLimits,
  ToolConfiguration: ToolConfiguration,
  ControlConfig_ControlModeNotification: ControlConfig_ControlModeNotification,
  AngularTwist: AngularTwist,
  TwistAngularSoftLimit: TwistAngularSoftLimit,
  ControlConfig_ServiceVersion: ControlConfig_ServiceVersion,
  CartesianTransform: CartesianTransform,
  ControlConfig_Position: ControlConfig_Position,
  TwistLinearSoftLimit: TwistLinearSoftLimit,
  KinematicLimitsList: KinematicLimitsList,
  SafetyStatus: SafetyStatus,
  CalibrationStatus: CalibrationStatus,
  CalibrationItem: CalibrationItem,
  IPv4Settings: IPv4Settings,
  PowerOnSelfTestResult: PowerOnSelfTestResult,
  RunMode: RunMode,
  ModelNumber: ModelNumber,
  SafetyInformationList: SafetyInformationList,
  PartNumberRevision: PartNumberRevision,
  DeviceType: DeviceType,
  CalibrationResult: CalibrationResult,
  DeviceConfig_CapSenseMode: DeviceConfig_CapSenseMode,
  CalibrationParameter_value: CalibrationParameter_value,
  SafetyThreshold: SafetyThreshold,
  SafetyConfigurationList: SafetyConfigurationList,
  DeviceConfig_SafetyLimitType: DeviceConfig_SafetyLimitType,
  FirmwareVersion: FirmwareVersion,
  MACAddress: MACAddress,
  PartNumber: PartNumber,
  DeviceConfig_CapSenseConfig: DeviceConfig_CapSenseConfig,
  SafetyEnable: SafetyEnable,
  RebootRqst: RebootRqst,
  CalibrationElement: CalibrationElement,
  SerialNumber: SerialNumber,
  SafetyConfiguration: SafetyConfiguration,
  DeviceConfig_ServiceVersion: DeviceConfig_ServiceVersion,
  BootloaderVersion: BootloaderVersion,
  SafetyInformation: SafetyInformation,
  CalibrationParameter: CalibrationParameter,
  RunModes: RunModes,
  Calibration: Calibration,
  CapSenseRegister: CapSenseRegister,
  DeviceManager_ServiceVersion: DeviceManager_ServiceVersion,
  DeviceHandles: DeviceHandles,
  GripperConfig_SafetyIdentifier: GripperConfig_SafetyIdentifier,
  RobotiqGripperStatusFlags: RobotiqGripperStatusFlags,
  GripperCyclic_Feedback: GripperCyclic_Feedback,
  GripperCyclic_Command: GripperCyclic_Command,
  MotorFeedback: MotorFeedback,
  GripperCyclic_CustomData: GripperCyclic_CustomData,
  GripperCyclic_MessageId: GripperCyclic_MessageId,
  GripperCyclic_ServiceVersion: GripperCyclic_ServiceVersion,
  MotorCommand: MotorCommand,
  CustomDataUnit: CustomDataUnit,
  I2CReadParameter: I2CReadParameter,
  I2CWriteRegisterParameter: I2CWriteRegisterParameter,
  EthernetSpeed: EthernetSpeed,
  GPIOIdentification: GPIOIdentification,
  EthernetDuplex: EthernetDuplex,
  I2CReadRegisterParameter: I2CReadRegisterParameter,
  GPIOMode: GPIOMode,
  EthernetConfiguration: EthernetConfiguration,
  EthernetDevice: EthernetDevice,
  GPIOValue: GPIOValue,
  UARTPortId: UARTPortId,
  I2CData: I2CData,
  EthernetDeviceIdentification: EthernetDeviceIdentification,
  InterconnectConfig_GPIOConfiguration: InterconnectConfig_GPIOConfiguration,
  I2CRegisterAddressSize: I2CRegisterAddressSize,
  I2CDeviceIdentification: I2CDeviceIdentification,
  I2CDeviceAddressing: I2CDeviceAddressing,
  I2CMode: I2CMode,
  GPIOPull: GPIOPull,
  I2CWriteParameter: I2CWriteParameter,
  I2CConfiguration: I2CConfiguration,
  InterconnectConfig_SafetyIdentifier: InterconnectConfig_SafetyIdentifier,
  I2CDevice: I2CDevice,
  GPIOIdentifier: GPIOIdentifier,
  InterconnectConfig_ServiceVersion: InterconnectConfig_ServiceVersion,
  GPIOState: GPIOState,
  InterconnectCyclic_Feedback_tool_feedback: InterconnectCyclic_Feedback_tool_feedback,
  InterconnectCyclic_Command_tool_command: InterconnectCyclic_Command_tool_command,
  InterconnectCyclic_MessageId: InterconnectCyclic_MessageId,
  InterconnectCyclic_CustomData: InterconnectCyclic_CustomData,
  InterconnectCyclic_Feedback: InterconnectCyclic_Feedback,
  InterconnectCyclic_CustomData_tool_customData: InterconnectCyclic_CustomData_tool_customData,
  InterconnectCyclic_Command: InterconnectCyclic_Command,
  InterconnectCyclic_ServiceVersion: InterconnectCyclic_ServiceVersion,
  VisionModuleType: VisionModuleType,
  EndEffectorType: EndEffectorType,
  BrakeType: BrakeType,
  BaseType: BaseType,
  WristType: WristType,
  InterfaceModuleType: InterfaceModuleType,
  ProductConfigurationEndEffectorType: ProductConfigurationEndEffectorType,
  ArmLaterality: ArmLaterality,
  CompleteProductConfiguration: CompleteProductConfiguration,
  ModelId: ModelId,
  BitRate: BitRate,
  VisionEvent: VisionEvent,
  Sensor: Sensor,
  TranslationVector: TranslationVector,
  SensorSettings: SensorSettings,
  VisionConfig_ServiceVersion: VisionConfig_ServiceVersion,
  SensorFocusAction: SensorFocusAction,
  FocusPoint: FocusPoint,
  DistortionCoefficients: DistortionCoefficients,
  ExtrinsicParameters: ExtrinsicParameters,
  Option: Option,
  OptionInformation: OptionInformation,
  VisionConfig_RotationMatrix: VisionConfig_RotationMatrix,
  VisionNotification: VisionNotification,
  Resolution: Resolution,
  SensorIdentifier: SensorIdentifier,
  VisionConfig_RotationMatrixRow: VisionConfig_RotationMatrixRow,
  OptionValue: OptionValue,
  IntrinsicProfileIdentifier: IntrinsicProfileIdentifier,
  FrameRate: FrameRate,
  FocusAction: FocusAction,
  ManualFocus: ManualFocus,
  SensorFocusAction_action_parameters: SensorFocusAction_action_parameters,
  OptionIdentifier: OptionIdentifier,
  IntrinsicParameters: IntrinsicParameters,
  FollowCartesianTrajectoryAction: FollowCartesianTrajectoryAction,
  FollowCartesianTrajectoryResult: FollowCartesianTrajectoryResult,
  FollowCartesianTrajectoryActionFeedback: FollowCartesianTrajectoryActionFeedback,
  FollowCartesianTrajectoryActionResult: FollowCartesianTrajectoryActionResult,
  FollowCartesianTrajectoryActionGoal: FollowCartesianTrajectoryActionGoal,
  FollowCartesianTrajectoryGoal: FollowCartesianTrajectoryGoal,
  FollowCartesianTrajectoryFeedback: FollowCartesianTrajectoryFeedback,
};
