<template>
  <div class="wrapper ">
    <!-- ====================================
  ——— LEFT SIDEBAR WITH OUT FOOTER
===================================== -->
    <aside class="left-sidebar sidebar-dark" id="left-sidebar">
      <div id="sidebar" class="sidebar sidebar-with-footer">
        <div class="app-brand">
          <RouterLink class="sidenav-item-link" to="/">
            <img :src="logo" alt="FluxEIP" width:20px />
            <span class="brand-name" style="margin-left:20px; font-size:x-large;">FluxEIP</span>
          </RouterLink>
        </div>
        <!-- begin sidebar scrollbar -->
        <div class="sidebar-left" data-simplebar style="height: 100%">
          <!-- sidebar menu -->
          <ul class="nav sidebar-inner" id="sidebar-menu">

            <!-- 單目錄的導引欄--個人資訊 -->
            <li :class="{ active: route.path === '/employee/detail' }">
              <RouterLink class="sidenav-item-link" to="/employee/detail"><i class="mdi mdi-account"></i>
                <span class="nav-text">個人資訊</span>
              </RouterLink>
            </li>
            <!-- 單目錄的導引欄結束 -->

            <!-- 有的子目錄的導引欄--員工管理 -->
            <li class="has-sub expand" :class="{ active: /^\/employee\/manage(\/.*)?$/.test(route.path) }">
              <a class="sidenav-item-link" href="javascript:void(0)" data-toggle="collapse" data-target="#employee"
                aria-expanded="false" aria-controls="employee">
                <i class="mdi mdi-account-box-multiple"></i>
                <span class="nav-text">員工管理</span> <b class="caret"></b>
              </a>
              <ul class="collapse" id="employee" data-parent="#sidebar-menu">
                <div class="sub-menu">
                  <li :class="{ active: route.path === '/employee/manage/search' }">
                    <RouterLink class="sidenav-item-link" to="/employee/manage/search">
                      <span class="nav-text">員工查詢</span>
                    </RouterLink>
                  </li>
                  <li :class="{ active: route.path === '/employee/manage/create' }">
                    <RouterLink class="sidenav-item-link" to="/employee/manage/create">
                      <span class="nav-text">新增員工</span>
                    </RouterLink>
                  </li>
                </div>
              </ul>
            </li>
            <!-- 有的子目錄的導引欄結束 -->


            <!-- 有的子目錄的導引欄--出勤與打卡 -->
            <li class="has-sub expand" :class="{ active: /^\/attendance(\/.*)?$/.test(route.path) }">
              <a class="sidenav-item-link" href="javascript:void(0)" data-toggle="collapse" data-target="#attendance"
                aria-expanded="false" aria-controls="attendance">
                <i class="mdi mdi-clock-outline"></i>
                <span class="nav-text">出勤與打卡</span> <b class="caret"></b>
              </a>
              <ul class="collapse" id="attendance" data-parent="#sidebar-menu">
                <div class="sub-menu">
                  <li :class="{ active: route.path === '/attendance/clock' }">
                    <RouterLink class="sidenav-item-link" to="/attendance/clock">
                      <span class="nav-text">打卡</span>
                    </RouterLink>
                  </li>
                  <li :class="{ active: route.path === '/attendance/log' }">
                    <RouterLink class="sidenav-item-link" to="/attendance/log">
                      <span class="nav-text">出勤記錄查詢</span>
                    </RouterLink>
                  </li>
                </div>
              </ul>
            </li>
            <!-- 有的子目錄的導引欄結束 -->


            <!-- 單目錄的導引欄--公佈欄 -->
            <li :class="{ active: route.path === '/bulletin' }">
              <RouterLink class="sidenav-item-link" to="/bulletin"><i class="mdi mdi-bulletin-board"></i>
                <span class="nav-text">公佈欄</span>
              </RouterLink>
            </li>
            <!-- 單目錄的導引欄結束 -->


            <!-- 有的子目錄的導引欄--會議管理 -->
            <li class="has-sub expand" :class="{ active: /^\/meeting(\/.*)?$/.test(route.path) }">
              <a class="sidenav-item-link" href="javascript:void(0)" data-toggle="collapse" data-target="#meeting"
                aria-expanded="false" aria-controls="meeting">
                <i class="mdi mdi-theater"></i>
                <span class="nav-text">會議</span> <b class="caret"></b>
              </a>
              <ul class="collapse" id="meeting" data-parent="#sidebar-menu">
                <div class="sub-menu">
                  <li :class="{ active: route.path === '/meeting/manage' }">
                    <RouterLink class="sidenav-item-link" to="/meeting/manage">
                      <span class="nav-text">會議室管理</span>
                    </RouterLink>
                  </li>
                  <li :class="{ active: route.path === '/meeting/create' }">
                    <RouterLink class="sidenav-item-link" to="/meeting/create">
                      <span class="nav-text">預約會議室</span>
                    </RouterLink>
                  </li>
                </div>
              </ul>
            </li>
            <!-- 有的子目錄的導引欄結束 -->


            <!-- 單目錄的導引欄--智庫 -->
            <li :class="{ active: route.path === '/guideline/all' }">
              <RouterLink class="sidenav-item-link" to="/guideline/all"><i class="mdi mdi-folder-outline"></i>
                <span class="nav-text">智庫</span>
              </RouterLink>
            </li>
            <!-- 單目錄的導引欄結束 -->

          </ul>
        </div>
      </div>
    </aside>

    <!-- ====================================
——— PAGE WRAPPER
===================================== -->

    <div class="page-wrapper">
      <!-- Header -->
      <header class="main-header" id="header">
        <nav class="navbar navbar-expand-lg navbar-light" id="navbar">
          <!-- Sidebar toggle button -->
          <button id="sidebar-toggler" class="sidebar-toggle">
            <span class="sr-only">Toggle navigation</span>
          </button>

          <span class="page-title">{{ pageTitle }} <!-- 這裡接收 App.vue 的標題 --></span>

          <div class="navbar-right">

            <ul class="nav navbar-nav">
              <!-- Offcanvas -->
              <li class="custom-dropdown">
                <a class="offcanvas-toggler active custom-dropdown-toggler" data-offcanvas="contact-off"
                  href="javascript:">
                  <i class="mdi mdi-contacts icon"></i>
                </a>
              </li>
              <li class="custom-dropdown">
                <button class="notify-toggler custom-dropdown-toggler">
                  <i class="mdi mdi-bell-outline icon"></i>
                  <span class="badge badge-xs rounded-circle">21</span>
                </button>
                <div class="dropdown-notify">
                  <header>
                    <div class="nav nav-underline" id="nav-tab" role="tablist">
                      <a class="nav-item nav-link active" id="all-tabs" data-toggle="tab" href="#all" role="tab"
                        aria-controls="nav-home" aria-selected="true">All (5)</a>
                      <a class="nav-item nav-link" id="message-tab" data-toggle="tab" href="#message" role="tab"
                        aria-controls="nav-profile" aria-selected="false">Msgs (4)</a>
                      <a class="nav-item nav-link" id="other-tab" data-toggle="tab" href="#other" role="tab"
                        aria-controls="nav-contact" aria-selected="false">Others (3)</a>
                    </div>
                  </header>

                  <div class="" data-simplebar style="height: 325px">
                    <div class="tab-content" id="myTabContent">
                      <div class="tab-pane fade show active" id="all" role="tabpanel" aria-labelledby="all-tabs">
                        <div class="media media-sm bg-warning-10 p-4 mb-0">
                          <div class="media-sm-wrapper">
                            <a href="user-profile.html">
                              <img src="" alt="User Image" />
                            </a>
                          </div>
                          <div class="media-body">
                            <a href="user-profile.html">
                              <span class="title mb-0">John Doe</span>
                              <span class="discribe">Extremity sweetness difficult behaviour he of.
                                On disposal of as landlord horrible. Afraid at
                                highly months do things on at.</span>
                              <span class="time">
                                <time>Just now</time>...
                              </span>
                            </a>
                          </div>
                        </div>

                        <div class="media media-sm p-4 bg-light mb-0">
                          <div class="media-sm-wrapper bg-primary">
                            <a href="user-profile.html">
                              <i class="mdi mdi-calendar-check-outline"></i>
                            </a>
                          </div>
                          <div class="media-body">
                            <a href="user-profile.html">
                              <span class="title mb-0">New event added</span>
                              <span class="discribe">1/3/2014 (1pm - 2pm)</span>
                              <span class="time">
                                <time>10 min ago...</time>...
                              </span>
                            </a>
                          </div>
                        </div>

                        <div class="media media-sm p-4 mb-0">
                          <div class="media-sm-wrapper">
                            <a href="user-profile.html">
                              <img src="" alt="User Image" />
                            </a>
                          </div>
                          <div class="media-body">
                            <a href="user-profile.html">
                              <span class="title mb-0">Sagge Hudson</span>
                              <span class="discribe">On disposal of as landlord Afraid at highly
                                months do things on at.</span>
                              <span class="time">
                                <time>1 hrs ago</time>...
                              </span>
                            </a>
                          </div>
                        </div>

                        <div class="media media-sm p-4 mb-0">
                          <div class="media-sm-wrapper bg-info-dark">
                            <a href="user-profile.html">
                              <i class="mdi mdi-account-multiple-check"></i>
                            </a>
                          </div>
                          <div class="media-body">
                            <a href="user-profile.html">
                              <span class="title mb-0">Add request</span>
                              <span class="discribe">Add Dany Jones as your contact.</span>
                              <div class="buttons">
                                <a href="#" class="btn btn-sm btn-success shadow-none text-white">accept</a>
                                <a href="#" class="btn btn-sm shadow-none">delete</a>
                              </div>
                              <span class="time">
                                <time>6 hrs ago</time>...
                              </span>
                            </a>
                          </div>
                        </div>

                        <div class="media media-sm p-4 mb-0">
                          <div class="media-sm-wrapper bg-info">
                            <a href="user-profile.html">
                              <i class="mdi mdi-playlist-check"></i>
                            </a>
                          </div>
                          <div class="media-body">
                            <a href="user-profile.html">
                              <span class="title mb-0">Task complete</span>
                              <span class="discribe">Afraid at highly months do things on at.</span>
                              <span class="time">
                                <time>1 hrs ago</time>...
                              </span>
                            </a>
                          </div>
                        </div>
                      </div>

                      <div class="tab-pane fade" id="message" role="tabpanel" aria-labelledby="message-tab">
                        <div class="media media-sm p-4 mb-0">
                          <div class="media-sm-wrapper">
                            <a href="user-profile.html">
                              <img src="" alt="User Image" />
                            </a>
                          </div>
                          <div class="media-body">
                            <a href="user-profile.html">
                              <span class="title mb-0">Selena Wagner</span>
                              <span class="discribe">Lorem ipsum dolor sit amet, consectetur
                                adipisicing elit.</span>
                              <span class="time">
                                <time>15 min ago</time>...
                              </span>
                            </a>
                          </div>
                        </div>

                        <div class="media media-sm p-4 mb-0">
                          <div class="media-sm-wrapper">
                            <a href="user-profile.html">
                              <img src="" alt="User Image" />
                            </a>
                          </div>
                          <div class="media-body">
                            <a href="user-profile.html">
                              <span class="title mb-0">Sagge Hudson</span>
                              <span class="discribe">On disposal of as landlord Afraid at highly
                                months do things on at.</span>
                              <span class="time">
                                <time>1 hrs ago</time>...
                              </span>
                            </a>
                          </div>
                        </div>

                        <div class="media media-sm bg-warning-10 p-4 mb-0">
                          <div class="media-sm-wrapper">
                            <a href="user-profile.html">
                              <img src="" alt="User Image" />
                            </a>
                          </div>
                          <div class="media-body">
                            <a href="user-profile.html">
                              <span class="title mb-0">John Doe</span>
                              <span class="discribe">Extremity sweetness difficult behaviour he of.
                                On disposal of as landlord horrible. Afraid at
                                highly months do things on at.</span>
                              <span class="time">
                                <time>Just now</time>...
                              </span>
                            </a>
                          </div>
                        </div>

                        <div class="media media-sm p-4 mb-0">
                          <div class="media-sm-wrapper">
                            <a href="user-profile.html">
                              <img src="" alt="User Image" />
                            </a>
                          </div>
                          <div class="media-body">
                            <a href="user-profile.html">
                              <span class="title mb-0">Albrecht Straub</span>
                              <span class="discribe">
                                Beatae quia natus assumenda laboriosam, nisi
                                perferendis aliquid consectetur expedita non
                                tenetur.</span>
                              <span class="time">
                                <time>Just now</time>...
                              </span>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div class="tab-pane fade" id="other" role="tabpanel" aria-labelledby="contact-tab">
                        <div class="media media-sm p-4 bg-light mb-0">
                          <div class="media-sm-wrapper bg-primary">
                            <a href="user-profile.html">
                              <i class="mdi mdi-calendar-check-outline"></i>
                            </a>
                          </div>
                          <div class="media-body">
                            <a href="user-profile.html">
                              <span class="title mb-0">New event added</span>
                              <span class="discribe">1/3/2014 (1pm - 2pm)</span>
                              <span class="time">
                                <time>10 min ago...</time>...
                              </span>
                            </a>
                          </div>
                        </div>

                        <div class="media media-sm p-4 mb-0">
                          <div class="media-sm-wrapper bg-info-dark">
                            <a href="user-profile.html">
                              <i class="mdi mdi-account-multiple-check"></i>
                            </a>
                          </div>
                          <div class="media-body">
                            <a href="user-profile.html">
                              <span class="title mb-0">Add request</span>
                              <span class="discribe">Add Dany Jones as your contact.</span>
                              <div class="buttons">
                                <a href="#" class="btn btn-sm btn-success shadow-none text-white">accept</a>
                                <a href="#" class="btn btn-sm shadow-none">delete</a>
                              </div>
                              <span class="time">
                                <time>6 hrs ago</time>...
                              </span>
                            </a>
                          </div>
                        </div>

                        <div class="media media-sm p-4 mb-0">
                          <div class="media-sm-wrapper bg-info">
                            <a href="user-profile.html">
                              <i class="mdi mdi-playlist-check"></i>
                            </a>
                          </div>
                          <div class="media-body">
                            <a href="user-profile.html">
                              <span class="title mb-0">Task complete</span>
                              <span class="discribe">Afraid at highly months do things on at.</span>
                              <span class="time">
                                <time>1 hrs ago</time>...
                              </span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <footer class="border-top dropdown-notify-footer">
                    <div class="d-flex justify-content-between align-items-center py-2 px-4">
                      <span>Last updated 3 min ago</span>
                      <a id="refress-button" href="javascript:" class="btn mdi mdi-cached btn-refress"></a>
                    </div>
                  </footer>
                </div>
              </li>
              <!-- User Account -->
              <li class="dropdown user-menu">
                <button class="dropdown-toggle nav-link" data-toggle="dropdown">
                  <img src="@/images/user/u-xl-1.jpg" class="user-image rounded-circle" alt="User Image" />
                  <span class="d-none d-lg-inline-block">John Doe</span>
                </button>
                <ul class="dropdown-menu dropdown-menu-right">
                  <li>
                    <RouterLink class="dropdown-link-item" to="/employee/detail"><i class="mdi mdi-account-outline"></i>
                      <span class="nav-text">個人資訊</span>
                    </RouterLink>
                  </li>
                  <li>
                    <a class="dropdown-link-item" href="email-inbox.html">
                      <i class="mdi mdi-email-outline"></i>
                      <span class="nav-text">Message</span>
                      <span class="badge badge-pill badge-primary">24</span>
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-link-item" href="user-activities.html">
                      <i class="mdi mdi-diamond-stone"></i>
                      <span class="nav-text">Activitise</span></a>
                  </li>
                  <li>
                    <a class="dropdown-link-item" href="user-account-settings.html">
                      <i class="mdi mdi-settings"></i>
                      <span class="nav-text">Account Setting</span>
                    </a>
                  </li>

                  <li class="dropdown-footer">
                    <a class="dropdown-link-item" href="sign-in.html">
                      <i class="mdi mdi-logout"></i> Log Out
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      <!-- ====================================
    ——— CONTENT WRAPPER
    ===================================== -->
      <div class="content-wrapper">
        <div class="content">
          <slot></slot>
        </div>

        <!-- Footer -->
        <footer class="footer mt-auto">
          <div class="copyright bg-white">
            <p>
              &copy; <span id="copy-year"></span> Copyright Mono Dashboard
              Bootstrap Template by
              <a class="text-primary" href="http://www.iamabdus.com/" target="_blank">Abdus</a>.
            </p>
          </div>
        </footer>
      </div>
    </div>
  </div>
  <!-- Card Offcanvas -->
  <div class="card card-offcanvas" id="contact-off">
    <div class="card-header">
      <h2>Contacts</h2>
      <a href="#" class="btn btn-primary btn-pill px-4">Add New</a>
    </div>
    <div class="card-body">

      <div class="mb-4">
        <input type="text" class="form-control form-control-lg form-control-secondary rounded-0"
          placeholder="Search contacts...">
      </div>

      <div class="media media-sm">
        <div class="media-sm-wrapper">
          <a href="user-profile.html">
            <img src="" alt="User Image">
            <span class="active bg-primary"></span>
          </a>
        </div>
        <div class="media-body">
          <a href="user-profile.html">
            <span class="title">Selena Wagner</span>
            <span class="discribe">Designer</span>
          </a>
        </div>
      </div>

      <div class="media media-sm">
        <div class="media-sm-wrapper">
          <a href="user-profile.html">
            <img src="" alt="User Image">
            <span class="active bg-primary"></span>
          </a>
        </div>
        <div class="media-body">
          <a href="user-profile.html">
            <span class="title">Walter Reuter</span>
            <span>Developer</span>
          </a>
        </div>
      </div>

      <div class="media media-sm">
        <div class="media-sm-wrapper">
          <a href="user-profile.html">
            <img src="" alt="User Image">
          </a>
        </div>
        <div class="media-body">
          <a href="user-profile.html">
            <span class="title">Larissa Gebhardt</span>
            <span>Cyber Punk</span>
          </a>
        </div>
      </div>

      <div class="media media-sm">
        <div class="media-sm-wrapper">
          <a href="user-profile.html">
            <img src="" alt="User Image">
          </a>

        </div>
        <div class="media-body">
          <a href="user-profile.html">
            <span class="title">Albrecht Straub</span>
            <span>Photographer</span>
          </a>
        </div>
      </div>

      <div class="media media-sm">
        <div class="media-sm-wrapper">
          <a href="user-profile.html">
            <img src="" alt="User Image">
            <span class="active bg-danger"></span>
          </a>
        </div>
        <div class="media-body">
          <a href="user-profile.html">
            <span class="title">Leopold Ebert</span>
            <span>Fashion Designer</span>
          </a>
        </div>
      </div>

      <div class="media media-sm">
        <div class="media-sm-wrapper">
          <a href="user-profile.html">
            <img src="" alt="User Image">
            <span class="active bg-primary"></span>
          </a>
        </div>
        <div class="media-body">
          <a href="user-profile.html">
            <span class="title">Selena Wagner</span>
            <span>Photographer</span>
          </a>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRoute } from "vue-router";
import logo from "@/images/dashboard.png"
import { computed } from 'vue';
const route = useRoute(); // 取得當前路由資訊
const pageTitle = computed(() => route.meta.title || '未命名頁面');




</script>

<style></style>
