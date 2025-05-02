import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useTheme } from '../context/ThemeContext';
import '../styles/ProjectBoard.css';

const TaskCard = ({ task, index, moveTask, columnId }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task.id, index, columnId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`task ${isDragging ? 'dragging' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="task-header">
        <span className={`priority-tag ${task.priority}`}>
          {task.priority}
        </span>
        <h3>{task.title}</h3>
      </div>
      <p className="task-description">{task.description}</p>
      <div className="task-footer">
        <span className="assignee">{task.assignee}</span>
        <span className="due-date">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

const Column = ({ column, moveTask }) => {
  const [, drop] = useDrop({
    accept: 'TASK',
    drop: (item) => {
      if (item.columnId !== column.id) {
        moveTask(item.id, item.columnId, column.id);
      }
    },
  });

  return (
    <div className="column" ref={drop}>
      <div className="column-header">
        <h2>{column.title}</h2>
        <span className="task-count">{column.tasks.length}</span>
      </div>
      <div className="tasks">
        {column.tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            index={index}
            moveTask={moveTask}
            columnId={column.id}
          />
        ))}
      </div>
    </div>
  );
};

const ProjectBoard = () => {
  const { theme } = useTheme();
  const [columns, setColumns] = useState({
    todo: {
      id: 'todo',
      title: 'To Do',
      tasks: [
        {
          id: '1',
          title: 'Design Landing Page',
          description: 'Create wireframes and mockups for the landing page',
          assignee: 'Sarah Johnson',
          priority: 'high',
          dueDate: '2024-03-15'
        },
        {
          id: '2',
          title: 'Set Up CI/CD Pipeline',
          description: 'Configure GitHub Actions for automated testing and deployment',
          assignee: 'Alex Chen',
          priority: 'medium',
          dueDate: '2024-03-20'
        }
      ]
    },
    inProgress: {
      id: 'inProgress',
      title: 'In Progress',
      tasks: [
        {
          id: '3',
          title: 'Implement Authentication',
          description: 'Set up JWT authentication and user management',
          assignee: 'Michael Rodriguez',
          priority: 'high',
          dueDate: '2024-03-18'
        }
      ]
    },
    review: {
      id: 'review',
      title: 'In Review',
      tasks: [
        {
          id: '4',
          title: 'API Documentation',
          description: 'Write and review API documentation',
          assignee: 'Alex Chen',
          priority: 'low',
          dueDate: '2024-03-16'
        }
      ]
    },
    done: {
      id: 'done',
      title: 'Done',
      tasks: [
        {
          id: '5',
          title: 'Database Schema',
          description: 'Design and implement database schema',
          assignee: 'Michael Rodriguez',
          priority: 'medium',
          dueDate: '2024-03-10'
        }
      ]
    }
  });

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: 'medium',
    dueDate: ''
  });

  const moveTask = (taskId, sourceColumnId, targetColumnId) => {
    setColumns(prev => {
      const sourceColumn = prev[sourceColumnId];
      const targetColumn = prev[targetColumnId];
      const taskToMove = sourceColumn.tasks.find(task => task.id === taskId);

      return {
        ...prev,
        [sourceColumnId]: {
          ...sourceColumn,
          tasks: sourceColumn.tasks.filter(task => task.id !== taskId)
        },
        [targetColumnId]: {
          ...targetColumn,
          tasks: [...targetColumn.tasks, taskToMove]
        }
      };
    });
  };

  const handleCreateTask = () => {
    if (!selectedColumn || !newTask.title) return;

    const task = {
      id: Date.now().toString(),
      ...newTask
    };

    setColumns(prev => ({
      ...prev,
      [selectedColumn]: {
        ...prev[selectedColumn],
        tasks: [...prev[selectedColumn].tasks, task]
      }
    }));

    setNewTask({
      title: '',
      description: '',
      assignee: '',
      priority: 'medium',
      dueDate: ''
    });
    setShowTaskModal(false);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`project-board ${theme}`}>
        <div className="board-header">
          <h1>Project Board</h1>
          <button
            className="create-task-btn"
            onClick={() => {
              setSelectedColumn('todo');
              setShowTaskModal(true);
            }}
          >
            + Create Task
          </button>
        </div>

        <div className="board-columns">
          {Object.values(columns).map(column => (
            <Column
              key={column.id}
              column={column}
              moveTask={moveTask}
            />
          ))}
        </div>

        {/* Create Task Modal */}
        <AnimatePresence>
          {showTaskModal && (
            <motion.div
              className="task-modal"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h2>Create New Task</h2>
                  <button
                    className="close-btn"
                    onClick={() => setShowTaskModal(false)}
                  >
                    ×
                  </button>
                </div>

                <div className="modal-body">
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      placeholder="Task title"
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      placeholder="Task description"
                    />
                  </div>

                  <div className="form-group">
                    <label>Assignee</label>
                    <input
                      type="text"
                      value={newTask.assignee}
                      onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                      placeholder="Assign to"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Priority</label>
                      <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Due Date</label>
                      <input
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    className="cancel-btn"
                    onClick={() => setShowTaskModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="create-btn"
                    onClick={handleCreateTask}
                  >
                    Create Task
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DndProvider>
  );
};

export default ProjectBoard; 