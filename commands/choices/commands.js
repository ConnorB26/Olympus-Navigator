const commands = [
    [
        'Add a goal: /add <character> <stars> <gear tier> <optional tag>',
        'Edit a goal: /edit <character> <stars> <gear tier> <optional tag>',
        'Set your progress on a goal: /progress <character> <stars> <gear tier>',
        'Complete a goal: /complete <character>',
        'Remove a goal: /remove <character>\n',
        'List all goals: /list all',
        'List only personal goals: /list personal',
        'List only club assigned goals: /list club'
    ],
    [
        'List all users with goals: /user list',
        'Show goals for specified user: /user get <user> <all, personal, or club>',
        'Remove all goals for specified user: /user remove <user>\n',
        'Add a club goal: /club add <character> <stars> <gear tier> <optional tag>',
        'Edit a club goal: /club edit <character> <stars> <gear tier> <optional tag>',
        'Remove a club goal: /club remove <character>'
    ]
];

export default commands;