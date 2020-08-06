<?php

if (!isset($_POST['jwt'])) {
    header('location: page-login.php');
}

include_once '..//..//common//helper.php';
include_once '..//..//api//config//core.php';
include_once '..//..//api//objects//token.php';

//leggo i dati via post
//var_dump($_POST['jwt']);
$jwt = new token($_POST['jwt'], $key);

$jwt->SetPathImg('img/user/');

?>

<div class="subheader">
    <h1 class="subheader-title">
        <i class='subheader-icon fal fa-home'></i> Home <span class='fw-300'><?=$jwt->GetNomeUtente() ?></span>
    </h1>
    <div class="subheader-block d-lg-flex align-items-center">
        <div class="d-inline-flex flex-column justify-content-center mr-3">
            <span class="fw-300 fs-xs d-block opacity-50">
                <small>Messaggi da leggere</small>
            </span>
            <span class="fw-500 fs-xl d-block color-primary-500">
                2
            </span>
        </div>
    </div>
    <div class="subheader-block d-lg-flex align-items-center border-faded border-right-0 border-top-0 border-bottom-0 ml-3 pl-3">
        <div class="d-inline-flex flex-column justify-content-center mr-3">
            <span class="fw-300 fs-xs d-block opacity-50">
                <small>Eventi di Oggi</small>
            </span>
            <span class="fw-500 fs-xl d-block color-danger-500">
               5
            </span>
        </div>
    </div>
</div>

<div class="row">
    
    <div class="col-lg-12">
        <div id="panel-1" class="panel" data-panel-fullscreen="false">
            <div class="panel-hdr">
                <h2>
                    GestMess
                </h2>
            </div>
            <div class="panel-container show">
                <div class="panel-content p-0">
                    <div class="d-flex flex-column">
                        <div class="bg-subtlelight-fade custom-scroll" style="height: 244px">
                            <div class="h-100">
                                <!-- message -->
                                <div class="d-flex flex-row px-3 pt-3 pb-2">
                                    <!-- profile photo : lazy loaded -->
                                    <span class="status status-danger">
                                        <span class="profile-image rounded-circle d-inline-block" style="background-image:url('img/demo/avatars/avatar-j.png')"></span>
                                    </span>
                                    <!-- profile photo end -->
                                    <div class="ml-3">
                                        <a href="javascript:void(0);" title="Lisa Hatchensen" class="d-block fw-700 text-dark">Lisa Hatchensen</a>
                                        Hey did you meet the new board of director? He's a bit of a geek if you ask me...anyway here is the report you requested. I am off to launch with Lisa and Andrew, you wanna join?
                                        <!-- file download -->
                                        <div class="d-flex mt-3 flex-wrap">
                                            <div class="btn-group mr-1 mt-1" role="group" aria-label="Button group with nested dropdown ">
                                                <button type="button" class="btn btn-default btn-xs btn-block px-1 py-1 fw-500" data-action="toggle">
                                                    <span class="d-block text-truncate text-truncate-sm">
                                                        <i class="fal fa-file-pdf mr-1 color-danger-700"></i> Report-2013-demographic-repo
                                                    </span>
                                                </button>
                                                <div class="btn-group" role="group">
                                                    <button id="btnGroupDrop1" type="button" class="btn btn-default btn-xs dropdown-toggle px-2 js-waves-off" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                                                    <div class="dropdown-menu p-0 fs-xs" aria-labelledby="btnGroupDrop1">
                                                        <a class="dropdown-item px-3 py-2" href="#">Forward</a>
                                                        <a class="dropdown-item px-3 py-2" href="#">Open</a>
                                                        <a class="dropdown-item px-3 py-2" href="#">Delete</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="btn-group mr-1 mt-1" role="group" aria-label="Button group with nested dropdown ">
                                                <button type="button" class="btn btn-default btn-xs btn-block px-1 py-1 fw-500" data-action="toggle">
                                                    <span class="d-block text-truncate text-truncate-sm">
                                                        <i class="fal fa-file-pdf mr-1 color-danger-700"></i> Bloodworks Patient 34124BA
                                                    </span>
                                                </button>
                                                <div class="btn-group" role="group">
                                                    <button id="btnGroupDrop2" type="button" class="btn btn-default btn-xs dropdown-toggle px-2 js-waves-off" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                                                    <div class="dropdown-menu p-0 fs-xs" aria-labelledby="btnGroupDrop2">
                                                        <a class="dropdown-item px-3 py-2" href="#">Forward</a>
                                                        <a class="dropdown-item px-3 py-2" href="#">Open</a>
                                                        <a class="dropdown-item px-3 py-2" href="#">Delete</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- file download end -->
                                    </div>
                                </div>
                                <!-- message end -->
                                <!-- message reply -->
                                <div class="d-flex flex-row px-3 pt-3 pb-2">
                                    <!-- profile photo : lazy loaded -->
                                    <span class="status status-danger">
                                        <span class="profile-image rounded-circle d-inline-block" style="background-image:url('img/demo/avatars/avatar-admin.png')"></span>
                                    </span>
                                    <!-- profile photo end -->
                                    <div class="ml-3">
                                        <a href="javascript:void(0);" title="Lisa Hatchensen" class="d-block fw-700 text-dark">Dr. Codex Lantern</a>
                                        Thanks for the file! You guys go ahead, I have to call some of my patients.
                                    </div>
                                </div>
                                <!-- message reply end -->
                            </div>
                        </div>
                    </div>
                </div>
                <div class="panel-content border-faded border-left-0 border-right-0 border-bottom-0 bg-faded">
                    <textarea rows="3" class="form-control rounded-top border-bottom-left-radius-0 border-bottom-right-radius-0 border" placeholder="write a reply..."></textarea>
                    <div class="d-flex align-items-center py-2 px-2 bg-white border border-top-0 rounded-bottom">
                        <div class="btn-group dropup">
                            <button type="button" class="btn btn-icon fs-lg dropdown-toggle no-arrow" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fal fa-smile"></i>
                            </button>
                            <div class="dropdown-menu dropdown-menu-animated text-center rounded-pill overflow-hidden" style="width: 280px">
                                <div class="px-1 py-0">
                                    <a href="javascript:void(0);" class="emoji emoji--like" data-toggle="tooltip" data-placement="top" title="" data-original-title="Like">
                                        <div class="emoji__hand">
                                            <div class="emoji__thumb"></div>
                                        </div>
                                    </a>
                                    <a href="javascript:void(0);" class="emoji emoji--love" data-toggle="tooltip" data-placement="top" title="" data-original-title="Love">
                                        <div class="emoji__heart"></div>
                                    </a>
                                    <a href="javascript:void(0);" class="emoji emoji--haha" data-toggle="tooltip" data-placement="top" title="" data-original-title="Haha">
                                        <div class="emoji__face">
                                            <div class="emoji__eyes"></div>
                                            <div class="emoji__mouth">
                                                <div class="emoji__tongue"></div>
                                            </div>
                                        </div>
                                    </a>
                                    <a href="javascript:void(0);" class="emoji emoji--yay" data-toggle="tooltip" data-placement="top" title="" data-original-title="Yay">
                                        <div class="emoji__face">
                                            <div class="emoji__eyebrows"></div>
                                            <div class="emoji__mouth"></div>
                                        </div>
                                    </a>
                                    <a href="javascript:void(0);" class="emoji emoji--wow" data-toggle="tooltip" data-placement="top" title="" data-original-title="Wow">
                                        <div class="emoji__face">
                                            <div class="emoji__eyebrows"></div>
                                            <div class="emoji__eyes"></div>
                                            <div class="emoji__mouth"></div>
                                        </div>
                                    </a>
                                    <a href="javascript:void(0);" class="emoji emoji--sad" data-toggle="tooltip" data-placement="top" title="" data-original-title="Sad">
                                        <div class="emoji__face">
                                            <div class="emoji__eyebrows"></div>
                                            <div class="emoji__eyes"></div>
                                            <div class="emoji__mouth"></div>
                                        </div>
                                    </a>
                                    <a href="javascript:void(0);" class="emoji emoji--angry" data-toggle="tooltip" data-placement="top" title="" data-original-title="Angry">
                                        <div class="emoji__face">
                                            <div class="emoji__eyebrows"></div>
                                            <div class="emoji__eyes"></div>
                                            <div class="emoji__mouth"></div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <button type="button" class="btn btn-icon fs-lg">
                            <i class="fal fa-paperclip"></i>
                        </button>
                        <div class="custom-control custom-checkbox custom-control-inline ml-auto hidden-sm-down">
                            <input type="checkbox" class="custom-control-input" id="defaultInline1">
                            <label class="custom-control-label" for="defaultInline1">Press <strong>ENTER</strong> to send</label>
                        </div>
                        <button class="btn btn-primary btn-sm ml-auto ml-sm-0">
                            Reply
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div id="panel-2" class="panel panel-locked" data-panel-lock="false" data-panel-close="false" data-panel-fullscreen="false" data-panel-collapsed="false" data-panel-color="false" data-panel-locked="false" data-panel-refresh="false" data-panel-reset="false">
            <div class="panel-hdr">
                <h2>
                    Eventi di oggi...
                </h2>
            </div>
            <div class="panel-container show">
                <div class="panel-content border-faded border-left-0 border-right-0 border-top-0">
                    <div class="row no-gutters">
                        <div class="col-lg-12 col-xl-12">
                            <div class="position-relative">
                                <div id="calendar"></div>
                            </div>
                        </div>
                      </div>
                </div>
            </div>
        </div>
    </div>
</div>