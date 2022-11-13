export interface SideBarItems {
  name: string,
  matIcon?: string,
  id?: string,
  routerLinkActive?: string,
  routerLink?: string
  children: SideBarChildren[]
}

export interface SideBarChildren {
  name: string,
  matIcon?: string,
  id: string,
  routerLinkActive: string,
  routerLink: string
}

export const sidebarItems: SideBarItems[] =
  [
    {
      name: 'ผู้ดูแลระบบ',
      children: [
        {
          name: 'จัดการฐานข้อมูล',
          matIcon: 'settings',
          id: '1',
          routerLink: '/maintenance/database',
          routerLinkActive: 'active'
        }
      ]
    },
    {
      name: 'ครู',
      children: [
        {
          name: 'เช็คชื่อเข้าเรียน',
          matIcon: 'access_time',
          id: '2',
          routerLink: '/check',
          routerLinkActive: 'active'
        },
        {
          name: 'RFID',
          matIcon: 'adb',
          id: '3',
          routerLink: '/rfid',
          routerLinkActive: 'active'
        },
        {
          name: 'จัดการใบงาน',
          matIcon: 'article',
          id: '4',
          routerLink: '/assignment',
          routerLinkActive: 'active'
        },
        {
          name: 'จัดการคะแนน',
          matIcon: 'face',
          id: '5',
          routerLink: '/scoring',
          routerLinkActive: 'active'
        },
        {
          name: 'Dashboard',
          matIcon: 'settings',
          id: '6',
          routerLink: '/dashboard',
          routerLinkActive: 'active'
        }
      ]
    },
  ]

export function getSideBarItemById(pageId: number[]) {
  return sidebarItems.map((i) => {
    const availableChildren = i.children.filter((j) => pageId.includes(+j.id));
    return ({ ...i, children: availableChildren });
  }).filter((j) => j.children.length > 0);

}