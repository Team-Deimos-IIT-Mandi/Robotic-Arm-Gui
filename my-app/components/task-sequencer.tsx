"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Play, Square, Plus, Trash2, Clock, CheckCircle, XCircle, Pause } from "lucide-react"
import { useState, useEffect } from "react"

interface Task {
  id: string
  name: string
  type: "move_joint" | "move_cartesian" | "gripper" | "wait" | "custom"
  parameters: Record<string, any>
  duration: number
  status: "pending" | "running" | "completed" | "failed"
  description: string
}

interface Sequence {
  id: string
  name: string
  tasks: Task[]
  status: "idle" | "running" | "paused" | "completed" | "failed"
  currentTaskIndex: number
  progress: number
}

export function TaskSequencer() {
  const [sequences, setSequences] = useState<Sequence[]>([])
  const [selectedSequence, setSelectedSequence] = useState<string | null>(null)
  const [newTaskType, setNewTaskType] = useState<Task["type"]>("move_joint")
  const [newTaskName, setNewTaskName] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")

  useEffect(() => {
    // Initialize with sample sequences
    const sampleSequences: Sequence[] = [
      {
        id: "seq1",
        name: "Pick and Place",
        status: "idle",
        currentTaskIndex: 0,
        progress: 0,
        tasks: [
          {
            id: "task1",
            name: "Move to Home",
            type: "move_joint",
            parameters: { joints: [0, 0, 0, 0, 0, 0] },
            duration: 3,
            status: "pending",
            description: "Move robot to home position",
          },
          {
            id: "task2",
            name: "Open Gripper",
            type: "gripper",
            parameters: { action: "open" },
            duration: 1,
            status: "pending",
            description: "Open gripper to prepare for picking",
          },
          {
            id: "task3",
            name: "Move to Object",
            type: "move_cartesian",
            parameters: { x: 0.5, y: 0.2, z: 0.1 },
            duration: 4,
            status: "pending",
            description: "Move to object location",
          },
          {
            id: "task4",
            name: "Close Gripper",
            type: "gripper",
            parameters: { action: "close" },
            duration: 1,
            status: "pending",
            description: "Grasp the object",
          },
          {
            id: "task5",
            name: "Move to Drop Zone",
            type: "move_cartesian",
            parameters: { x: -0.3, y: 0.4, z: 0.2 },
            duration: 5,
            status: "pending",
            description: "Transport object to drop location",
          },
        ],
      },
      {
        id: "seq2",
        name: "Calibration Routine",
        status: "idle",
        currentTaskIndex: 0,
        progress: 0,
        tasks: [
          {
            id: "cal1",
            name: "Joint Calibration",
            type: "custom",
            parameters: { script: "calibrate_joints.py" },
            duration: 10,
            status: "pending",
            description: "Calibrate all joint encoders",
          },
          {
            id: "cal2",
            name: "Vision Calibration",
            type: "custom",
            parameters: { script: "calibrate_camera.py" },
            duration: 15,
            status: "pending",
            description: "Calibrate camera-robot transformation",
          },
        ],
      },
    ]
    setSequences(sampleSequences)
    setSelectedSequence(sampleSequences[0].id)
  }, [])

  const currentSequence = sequences.find((seq) => seq.id === selectedSequence)

  const executeSequence = (sequenceId: string) => {
    setSequences((prev) =>
      prev.map((seq) =>
        seq.id === sequenceId ? { ...seq, status: "running", currentTaskIndex: 0, progress: 0 } : seq,
      ),
    )

    // Simulate sequence execution
    simulateSequenceExecution(sequenceId)
  }

  const simulateSequenceExecution = (sequenceId: string) => {
    const sequence = sequences.find((seq) => seq.id === sequenceId)
    if (!sequence) return

    let taskIndex = 0
    const executeTask = () => {
      if (taskIndex >= sequence.tasks.length) {
        // Sequence completed
        setSequences((prev) =>
          prev.map((seq) => (seq.id === sequenceId ? { ...seq, status: "completed", progress: 100 } : seq)),
        )
        return
      }

      const task = sequence.tasks[taskIndex]

      // Start task
      setSequences((prev) =>
        prev.map((seq) =>
          seq.id === sequenceId
            ? {
                ...seq,
                currentTaskIndex: taskIndex,
                tasks: seq.tasks.map((t, i) => (i === taskIndex ? { ...t, status: "running" } : t)),
              }
            : seq,
        ),
      )

      // Complete task after duration
      setTimeout(() => {
        setSequences((prev) =>
          prev.map((seq) =>
            seq.id === sequenceId
              ? {
                  ...seq,
                  progress: ((taskIndex + 1) / seq.tasks.length) * 100,
                  tasks: seq.tasks.map((t, i) => (i === taskIndex ? { ...t, status: "completed" } : t)),
                }
              : seq,
          ),
        )

        taskIndex++
        executeTask()
      }, task.duration * 1000)
    }

    executeTask()
  }

  const pauseSequence = (sequenceId: string) => {
    setSequences((prev) => prev.map((seq) => (seq.id === sequenceId ? { ...seq, status: "paused" } : seq)))
  }

  const stopSequence = (sequenceId: string) => {
    setSequences((prev) =>
      prev.map((seq) =>
        seq.id === sequenceId
          ? {
              ...seq,
              status: "idle",
              currentTaskIndex: 0,
              progress: 0,
              tasks: seq.tasks.map((task) => ({ ...task, status: "pending" })),
            }
          : seq,
      ),
    )
  }

  const addTask = () => {
    if (!currentSequence || !newTaskName) return

    const newTask: Task = {
      id: `task_${Date.now()}`,
      name: newTaskName,
      type: newTaskType,
      parameters: {},
      duration: 3,
      status: "pending",
      description: newTaskDescription,
    }

    setSequences((prev) =>
      prev.map((seq) => (seq.id === selectedSequence ? { ...seq, tasks: [...seq.tasks, newTask] } : seq)),
    )

    setNewTaskName("")
    setNewTaskDescription("")
  }

  const removeTask = (taskId: string) => {
    if (!currentSequence) return

    setSequences((prev) =>
      prev.map((seq) =>
        seq.id === selectedSequence ? { ...seq, tasks: seq.tasks.filter((task) => task.id !== taskId) } : seq,
      ),
    )
  }

  const getTaskIcon = (status: Task["status"]) => {
    switch (status) {
      case "running":
        return <Play className="h-4 w-4 text-blue-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "running":
        return "default" as const
      case "completed":
        return "default" as const
      case "failed":
        return "destructive" as const
      case "paused":
        return "secondary" as const
      default:
        return "outline" as const
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sequence List and Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Task Sequences</CardTitle>
          <CardDescription>Manage and execute automated task sequences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sequence Selection */}
          <div className="space-y-2">
            <Label>Select Sequence</Label>
            <Select value={selectedSequence || ""} onValueChange={setSelectedSequence}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a sequence" />
              </SelectTrigger>
              <SelectContent>
                {sequences.map((seq) => (
                  <SelectItem key={seq.id} value={seq.id}>
                    {seq.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sequence Status */}
          {currentSequence && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{currentSequence.name}</span>
                <Badge variant={getStatusVariant(currentSequence.status)}>{currentSequence.status.toUpperCase()}</Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{currentSequence.progress.toFixed(0)}%</span>
                </div>
                <Progress value={currentSequence.progress} className="h-2" />
              </div>

              <div className="flex gap-2">
                {currentSequence.status === "idle" && (
                  <Button onClick={() => executeSequence(currentSequence.id)} className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Execute
                  </Button>
                )}
                {currentSequence.status === "running" && (
                  <>
                    <Button
                      variant="secondary"
                      onClick={() => pauseSequence(currentSequence.id)}
                      className="flex items-center gap-2"
                    >
                      <Pause className="h-4 w-4" />
                      Pause
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => stopSequence(currentSequence.id)}
                      className="flex items-center gap-2"
                    >
                      <Square className="h-4 w-4" />
                      Stop
                    </Button>
                  </>
                )}
                {(currentSequence.status === "paused" || currentSequence.status === "completed") && (
                  <Button
                    variant="outline"
                    onClick={() => stopSequence(currentSequence.id)}
                    className="flex items-center gap-2"
                  >
                    <Square className="h-4 w-4" />
                    Reset
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task List and Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Task Editor</CardTitle>
          <CardDescription>View and edit tasks in the selected sequence</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Task */}
          <div className="space-y-3 p-3 border rounded-lg">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Task Type</Label>
                <Select value={newTaskType} onValueChange={(value: Task["type"]) => setNewTaskType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="move_joint">Move Joint</SelectItem>
                    <SelectItem value="move_cartesian">Move Cartesian</SelectItem>
                    <SelectItem value="gripper">Gripper</SelectItem>
                    <SelectItem value="wait">Wait</SelectItem>
                    <SelectItem value="custom">Custom Script</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Task Name</Label>
                <Input
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  placeholder="Enter task name"
                />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Task description"
                rows={2}
              />
            </div>
            <Button onClick={addTask} className="flex items-center gap-2" disabled={!newTaskName}>
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </div>

          {/* Task List */}
          {currentSequence && (
            <ScrollArea className="h-64 w-full border rounded-lg p-3">
              <div className="space-y-2">
                {currentSequence.tasks.map((task, index) => (
                  <div key={task.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-3">
                      {getTaskIcon(task.status)}
                      <div>
                        <div className="font-medium text-sm">{task.name}</div>
                        <div className="text-xs text-muted-foreground">{task.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono">{task.duration}s</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTask(task.id)}
                        disabled={currentSequence.status === "running"}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                {currentSequence.tasks.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No tasks in this sequence. Add tasks above.
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
