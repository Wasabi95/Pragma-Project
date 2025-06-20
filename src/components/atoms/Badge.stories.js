// src/components/atoms/Badge.stories.js
import React from 'react';
import Badge from './Badge';

// This is the default export that tells Storybook about your component
export default {
  title: 'Atoms/Badge', // How it will appear in the Storybook sidebar
  component: Badge,
  // You can define default args for your stories
  args: {
    children: 'My Badge',
  },
};

// A "story" is a function that returns a rendered component
const Template = (args) => <Badge {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  type: 'primary',
  children: 'Primary Badge',
};

export const Secondary = Template.bind({});
Secondary.args = {
  type: 'secondary',
  children: 'Secondary Badge',
};

export const Success = Template.bind({});
Success.args = {
  type: 'success',
  children: 'Success!',
};

export const Danger = Template.bind({});
Danger.args = {
  type: 'danger',
  children: 'Danger Zone',
};