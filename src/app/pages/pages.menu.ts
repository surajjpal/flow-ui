export const PAGES_MENU = [
  {
    path: 'pages',
    children: [
      {
        path: 'inbox',
        data: {
          menu: {
            title: 'Inbox',
            icon: 'ion-compose',
            selected: false,
            expanded: false,
            order: 1
          }
        },
        children: [
          {
            path: 'tasks',
            data: {
              menu: {
                title: 'Tasks'
              }
            }
          }
        ]
      },
      {
        path: 'auto',
        data: {
          menu: {
            title: 'Auto',
            icon: 'ion-android-person',
            selected: false,
            expanded: false,
            order: 2
          }
        },
        children: [
          {
            path: 'dashboard',
            data: {
              menu: {
                title: 'Dashboard'
              }
            }
          },
          {
            path: 'conversation',
            data: {
              menu: {
                title: 'Conversation'
              }
            }
          },
          {
            path: 'training',
            data: {
              menu: {
                title: 'Training'
              }
            }
          }
        ]
      },
      {
        path: 'flow',
        data: {
          menu: {
            title: 'Flow',
            icon: 'ion-network',
            selected: false,
            expanded: false,
            order: 3
          }
        },
        children: [
          {
            path: 'dashboard',
            data: {
              menu: {
                title: 'Dashboard'
              }
            }
          },
          {
            path: 'search',
            data: {
              menu: {
                title: 'Search'
              }
            }
          },
          {
            path: 'design',
            data: {
              menu: {
                title: 'Design'
              }
            }
          }
        ]
      }
    ]
  }
];
