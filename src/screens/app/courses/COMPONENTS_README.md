# Courses Module - Component Structure

## Overview
This module has been refactored to follow best practices with proper component separation and reusability.

## File Structure

```
courses/
├── CoursesScreen.js          # Main courses list screen
├── CourseDetails.js          # Individual course detail screen
└── components/
    ├── index.js              # Centralized exports
    ├── CoursesSummaryHeader.js    # Summary header with progress
    ├── CourseListItem.js          # Individual course card
    ├── CourseAvatarStack.js       # Avatar stack component
    ├── SeedCoursesButton.js       # Dev seed courses button
    ├── CourseHeroHeader.js        # Course detail hero section
    ├── CourseDetailsCard.js       # Course info card
    ├── CourseProgressCard.js      # Progress tracking card
    ├── TaskCard.js                # Individual task item
    ├── ProTipCard.js              # Daily tip card
    ├── WeekOverviewItem.js        # Week overview day item
    └── LockedCourseMessage.js     # Locked course message
```

## Component Descriptions

### CoursesScreen Components

#### CoursesSummaryHeader
Displays overall user progress across all courses.
- Props: `summary` (object with courseCount, completionRatio, streak)

#### CourseListItem
Individual course card in the list.
- Props: `course`, `progress`, `onPress`, `formatUnlockDate`

#### CourseAvatarStack
Displays stacked avatars representing enrolled users.
- Props: None (static component)

#### SeedCoursesButton
Development button to seed course data.
- Props: `onPress`

### CourseDetails Components

#### CourseHeroHeader
Hero section with gradient background and course info.
- Props: `course`, `totalDays`, `onReset`

#### CourseDetailsCard
Displays course title, description, and metadata.
- Props: `course`, `totalDays`

#### CourseProgressCard
Shows user's progress through the course.
- Props: `progress`, `currentDayNumber`, `totalDays`, `completionRatio`

#### TaskCard
Individual task item with checkbox and details.
- Props: `task`, `index`, `isComplete`, `onToggle`, `dayNumber`, `disabled`

#### ProTipCard
Displays daily pro tip if available.
- Props: `tip`

#### WeekOverviewItem
Single day item in week overview section.
- Props: `day`, `isCompleted`, `isToday`, `isLocked`, `completedTasksCount`, `totalTasksCount`

#### LockedCourseMessage
Message shown when course is locked or coming soon.
- Props: `isComingSoon`

## Benefits of This Structure

1. **Separation of Concerns**: Each component has a single responsibility
2. **Reusability**: Components can be reused across different screens
3. **Maintainability**: Easier to find and fix bugs
4. **Testability**: Each component can be tested independently
5. **Readability**: Main screen files are much cleaner and easier to understand
6. **Scalability**: Easy to add new features without cluttering main files

## Usage Example

```javascript
import {
  CoursesSummaryHeader,
  CourseListItem,
  SeedCoursesButton
} from './components';

// Or individual imports
import CourseHeroHeader from './components/CourseHeroHeader';
```

## Styling Convention

All components follow a consistent styling pattern:
- Styles defined at component level
- Color constants for consistency
- Responsive sizing
- Proper accessibility labels

## Future Improvements

- [ ] Add PropTypes or TypeScript for type safety
- [ ] Add component-level tests
- [ ] Extract common styles to shared theme
- [ ] Add loading states to components
- [ ] Add error boundaries
