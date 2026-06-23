/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams:
        | { pathname: Router.RelativePathString; params?: Router.UnknownInputParams }
        | { pathname: Router.ExternalPathString; params?: Router.UnknownInputParams }
        | { pathname: `/exemplo`; params?: Router.UnknownInputParams }
        | { pathname: `/`; params?: Router.UnknownInputParams }
        | { pathname: `/preview-passenger-list`; params?: Router.UnknownInputParams }
        | { pathname: `/_sitemap`; params?: Router.UnknownInputParams }
        | {
            pathname: `${'/(auth)'}/forgot-password-screen` | `/forgot-password-screen`;
            params?: Router.UnknownInputParams;
          }
        | { pathname: `${'/(auth)'}/login` | `/login`; params?: Router.UnknownInputParams }
        | {
            pathname: `${'/(auth)'}/offline-screen` | `/offline-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${'/(auth)'}/onboarding` | `/onboarding`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${'/(auth)'}/register-success` | `/register-success`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${'/(auth)'}/reset-password-screen` | `/reset-password-screen`;
            params?: Router.UnknownInputParams;
          }
        | { pathname: `${'/(auth)'}/splash` | `/splash`; params?: Router.UnknownInputParams }
        | {
            pathname: `${'/(driver)'}/driver-home` | `/driver-home`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${'/(driver)'}/profile-driver-screen` | `/profile-driver-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${'/(driver)'}/vehicle-details-screen` | `/vehicle-details-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${'/(driver)'}${'/(route)'}/active-route-details-screen`
              | `/active-route-details-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${'/(driver)'}${'/(route)'}/active-route-screen` | `/active-route-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${'/(driver)'}${'/(route)'}/create-route-destination-screen`
              | `/create-route-destination-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${'/(driver)'}${'/(route)'}/create-route-info-screen`
              | `/create-route-info-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${'/(driver)'}${'/(route)'}/create-route-origin-screen`
              | `/create-route-origin-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${'/(driver)'}${'/(route)'}/edit-route-screen` | `/edit-route-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${'/(driver)'}${'/(route)'}/enter-route-code-screen`
              | `/enter-route-code-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${'/(driver)'}${'/(route)'}/route-details-screen` | `/route-details-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${'/(driver)'}${'/(route)'}/route-invite-code-screen`
              | `/route-invite-code-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${'/(driver)'}${'/(route)'}/route-passengers-screen`
              | `/route-passengers-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${'/(driver)'}${'/(route)'}/schedule` | `/schedule`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${'/(driver)'}${'/(route)'}/trip-metrics-screen` | `/trip-metrics-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${'/(driver)'}${'/(route)'}/trip-reports-screen` | `/trip-reports-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${'/(passenger)'}/dependent-details-screen` | `/dependent-details-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${'/(passenger)'}/enter-route-code-screen` | `/enter-route-code-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${'/(passenger)'}/participant-selection-screen`
              | `/participant-selection-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${'/(passenger)'}/passenger-active-route-details-screen`
              | `/passenger-active-route-details-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${'/(passenger)'}/passenger-active-route-screen`
              | `/passenger-active-route-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${'/(passenger)'}/passenger-address-screen` | `/passenger-address-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${'/(passenger)'}/passenger-home-screen` | `/passenger-home-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${'/(passenger)'}/passenger-route-details-screen`
              | `/passenger-route-details-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${'/(passenger)'}/profile-passenger-screen` | `/profile-passenger-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${'/(shared)'}/edit-profile-screen` | `/edit-profile-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${'/(shared)'}/register-basic-info-screen` | `/register-basic-info-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${'/(shared)'}/register-driver-details-screen`
              | `/register-driver-details-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${'/(shared)'}/register-passenger-details` | `/register-passenger-details`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${'/(shared)'}/register-profile-selection-screen`
              | `/register-profile-selection-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${'/(shared)'}/user-settings-screen` | `/user-settings-screen`;
            params?: Router.UnknownInputParams;
          };
      hrefOutputParams:
        | { pathname: Router.RelativePathString; params?: Router.UnknownOutputParams }
        | { pathname: Router.ExternalPathString; params?: Router.UnknownOutputParams }
        | { pathname: `/exemplo`; params?: Router.UnknownOutputParams }
        | { pathname: `/`; params?: Router.UnknownOutputParams }
        | { pathname: `/preview-passenger-list`; params?: Router.UnknownOutputParams }
        | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams }
        | {
            pathname: `${'/(auth)'}/forgot-password-screen` | `/forgot-password-screen`;
            params?: Router.UnknownOutputParams;
          }
        | { pathname: `${'/(auth)'}/login` | `/login`; params?: Router.UnknownOutputParams }
        | {
            pathname: `${'/(auth)'}/offline-screen` | `/offline-screen`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: `${'/(auth)'}/onboarding` | `/onboarding`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: `${'/(auth)'}/register-success` | `/register-success`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: `${'/(auth)'}/reset-password-screen` | `/reset-password-screen`;
            params?: Router.UnknownOutputParams;
          }
        | { pathname: `${'/(auth)'}/splash` | `/splash`; params?: Router.UnknownOutputParams }
        | {
            pathname: `${'/(driver)'}/driver-home` | `/driver-home`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: `${'/(driver)'}/profile-driver-screen` | `/profile-driver-screen`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: `${'/(driver)'}/vehicle-details-screen` | `/vehicle-details-screen`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname:
              | `${'/(driver)'}${'/(route)'}/active-route-details-screen`
              | `/active-route-details-screen`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: `${'/(driver)'}${'/(route)'}/active-route-screen` | `/active-route-screen`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname:
              | `${'/(driver)'}${'/(route)'}/create-route-destination-screen`
              | `/create-route-destination-screen`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname:
              | `${'/(driver)'}${'/(route)'}/create-route-info-screen`
              | `/create-route-info-screen`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname:
              | `${'/(driver)'}${'/(route)'}/create-route-origin-screen`
              | `/create-route-origin-screen`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: `${'/(driver)'}${'/(route)'}/edit-route-screen` | `/edit-route-screen`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname:
              | `${'/(driver)'}${'/(route)'}/enter-route-code-screen`
              | `/enter-route-code-screen`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: `${'/(driver)'}${'/(route)'}/route-details-screen` | `/route-details-screen`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname:
              | `${'/(driver)'}${'/(route)'}/route-invite-code-screen`
              | `/route-invite-code-screen`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname:
              | `${'/(driver)'}${'/(route)'}/route-passengers-screen`
              | `/route-passengers-screen`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: `${'/(driver)'}${'/(route)'}/schedule` | `/schedule`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: `${'/(driver)'}${'/(route)'}/trip-metrics-screen` | `/trip-metrics-screen`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: `${'/(driver)'}${'/(route)'}/trip-reports-screen` | `/trip-reports-screen`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: `${'/(passenger)'}/dependent-details-screen` | `/dependent-details-screen`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: `${'/(passenger)'}/enter-route-code-screen` | `/enter-route-code-screen`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname:
              | `${'/(passenger)'}/participant-selection-screen`
              | `/participant-selection-screen`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname:
              | `${'/(passenger)'}/passenger-active-route-details-screen`
              | `/passenger-active-route-details-screen`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname:
              | `${'/(passenger)'}/passenger-active-route-screen`
              | `/passenger-active-route-screen`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: `${'/(passenger)'}/passenger-address-screen` | `/passenger-address-screen`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: `${'/(passenger)'}/passenger-home-screen` | `/passenger-home-screen`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname:
              | `${'/(passenger)'}/passenger-route-details-screen`
              | `/passenger-route-details-screen`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: `${'/(passenger)'}/profile-passenger-screen` | `/profile-passenger-screen`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: `${'/(shared)'}/edit-profile-screen` | `/edit-profile-screen`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: `${'/(shared)'}/register-basic-info-screen` | `/register-basic-info-screen`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname:
              | `${'/(shared)'}/register-driver-details-screen`
              | `/register-driver-details-screen`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: `${'/(shared)'}/register-passenger-details` | `/register-passenger-details`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname:
              | `${'/(shared)'}/register-profile-selection-screen`
              | `/register-profile-selection-screen`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: `${'/(shared)'}/user-settings-screen` | `/user-settings-screen`;
            params?: Router.UnknownOutputParams;
          };
      href:
        | Router.RelativePathString
        | Router.ExternalPathString
        | `/exemplo${`?${string}` | `#${string}` | ''}`
        | `/${`?${string}` | `#${string}` | ''}`
        | `/preview-passenger-list${`?${string}` | `#${string}` | ''}`
        | `/_sitemap${`?${string}` | `#${string}` | ''}`
        | `${'/(auth)'}/forgot-password-screen${`?${string}` | `#${string}` | ''}`
        | `/forgot-password-screen${`?${string}` | `#${string}` | ''}`
        | `${'/(auth)'}/login${`?${string}` | `#${string}` | ''}`
        | `/login${`?${string}` | `#${string}` | ''}`
        | `${'/(auth)'}/offline-screen${`?${string}` | `#${string}` | ''}`
        | `/offline-screen${`?${string}` | `#${string}` | ''}`
        | `${'/(auth)'}/onboarding${`?${string}` | `#${string}` | ''}`
        | `/onboarding${`?${string}` | `#${string}` | ''}`
        | `${'/(auth)'}/register-success${`?${string}` | `#${string}` | ''}`
        | `/register-success${`?${string}` | `#${string}` | ''}`
        | `${'/(auth)'}/reset-password-screen${`?${string}` | `#${string}` | ''}`
        | `/reset-password-screen${`?${string}` | `#${string}` | ''}`
        | `${'/(auth)'}/splash${`?${string}` | `#${string}` | ''}`
        | `/splash${`?${string}` | `#${string}` | ''}`
        | `${'/(driver)'}/driver-home${`?${string}` | `#${string}` | ''}`
        | `/driver-home${`?${string}` | `#${string}` | ''}`
        | `${'/(driver)'}/profile-driver-screen${`?${string}` | `#${string}` | ''}`
        | `/profile-driver-screen${`?${string}` | `#${string}` | ''}`
        | `${'/(driver)'}/vehicle-details-screen${`?${string}` | `#${string}` | ''}`
        | `/vehicle-details-screen${`?${string}` | `#${string}` | ''}`
        | `${'/(driver)'}${'/(route)'}/active-route-details-screen${`?${string}` | `#${string}` | ''}`
        | `/active-route-details-screen${`?${string}` | `#${string}` | ''}`
        | `${'/(driver)'}${'/(route)'}/active-route-screen${`?${string}` | `#${string}` | ''}`
        | `/active-route-screen${`?${string}` | `#${string}` | ''}`
        | `${'/(driver)'}${'/(route)'}/create-route-destination-screen${`?${string}` | `#${string}` | ''}`
        | `/create-route-destination-screen${`?${string}` | `#${string}` | ''}`
        | `${'/(driver)'}${'/(route)'}/create-route-info-screen${`?${string}` | `#${string}` | ''}`
        | `/create-route-info-screen${`?${string}` | `#${string}` | ''}`
        | `${'/(driver)'}${'/(route)'}/create-route-origin-screen${`?${string}` | `#${string}` | ''}`
        | `/create-route-origin-screen${`?${string}` | `#${string}` | ''}`
        | `${'/(driver)'}${'/(route)'}/edit-route-screen${`?${string}` | `#${string}` | ''}`
        | `/edit-route-screen${`?${string}` | `#${string}` | ''}`
        | `${'/(driver)'}${'/(route)'}/enter-route-code-screen${`?${string}` | `#${string}` | ''}`
        | `/enter-route-code-screen${`?${string}` | `#${string}` | ''}`
        | `${'/(driver)'}${'/(route)'}/route-details-screen${`?${string}` | `#${string}` | ''}`
        | `/route-details-screen${`?${string}` | `#${string}` | ''}`
        | `${'/(driver)'}${'/(route)'}/route-invite-code-screen${`?${string}` | `#${string}` | ''}`
        | `/route-invite-code-screen${`?${string}` | `#${string}` | ''}`
        | `${'/(driver)'}${'/(route)'}/route-passengers-screen${`?${string}` | `#${string}` | ''}`
        | `/route-passengers-screen${`?${string}` | `#${string}` | ''}`
        | `${'/(driver)'}${'/(route)'}/schedule${`?${string}` | `#${string}` | ''}`
        | `/schedule${`?${string}` | `#${string}` | ''}`
        | `${'/(driver)'}${'/(route)'}/trip-metrics-screen${`?${string}` | `#${string}` | ''}`
        | `/trip-metrics-screen${`?${string}` | `#${string}` | ''}`
        | `${'/(driver)'}${'/(route)'}/trip-reports-screen${`?${string}` | `#${string}` | ''}`
        | `/trip-reports-screen${`?${string}` | `#${string}` | ''}`
        | `${'/(passenger)'}/dependent-details-screen${`?${string}` | `#${string}` | ''}`
        | `/dependent-details-screen${`?${string}` | `#${string}` | ''}`
        | `${'/(passenger)'}/enter-route-code-screen${`?${string}` | `#${string}` | ''}`
        | `/enter-route-code-screen${`?${string}` | `#${string}` | ''}`
        | `${'/(passenger)'}/participant-selection-screen${`?${string}` | `#${string}` | ''}`
        | `/participant-selection-screen${`?${string}` | `#${string}` | ''}`
        | `${'/(passenger)'}/passenger-active-route-details-screen${`?${string}` | `#${string}` | ''}`
        | `/passenger-active-route-details-screen${`?${string}` | `#${string}` | ''}`
        | `${'/(passenger)'}/passenger-active-route-screen${`?${string}` | `#${string}` | ''}`
        | `/passenger-active-route-screen${`?${string}` | `#${string}` | ''}`
        | `${'/(passenger)'}/passenger-address-screen${`?${string}` | `#${string}` | ''}`
        | `/passenger-address-screen${`?${string}` | `#${string}` | ''}`
        | `${'/(passenger)'}/passenger-home-screen${`?${string}` | `#${string}` | ''}`
        | `/passenger-home-screen${`?${string}` | `#${string}` | ''}`
        | `${'/(passenger)'}/passenger-route-details-screen${`?${string}` | `#${string}` | ''}`
        | `/passenger-route-details-screen${`?${string}` | `#${string}` | ''}`
        | `${'/(passenger)'}/profile-passenger-screen${`?${string}` | `#${string}` | ''}`
        | `/profile-passenger-screen${`?${string}` | `#${string}` | ''}`
        | `${'/(shared)'}/edit-profile-screen${`?${string}` | `#${string}` | ''}`
        | `/edit-profile-screen${`?${string}` | `#${string}` | ''}`
        | `${'/(shared)'}/register-basic-info-screen${`?${string}` | `#${string}` | ''}`
        | `/register-basic-info-screen${`?${string}` | `#${string}` | ''}`
        | `${'/(shared)'}/register-driver-details-screen${`?${string}` | `#${string}` | ''}`
        | `/register-driver-details-screen${`?${string}` | `#${string}` | ''}`
        | `${'/(shared)'}/register-passenger-details${`?${string}` | `#${string}` | ''}`
        | `/register-passenger-details${`?${string}` | `#${string}` | ''}`
        | `${'/(shared)'}/register-profile-selection-screen${`?${string}` | `#${string}` | ''}`
        | `/register-profile-selection-screen${`?${string}` | `#${string}` | ''}`
        | `${'/(shared)'}/user-settings-screen${`?${string}` | `#${string}` | ''}`
        | `/user-settings-screen${`?${string}` | `#${string}` | ''}`
        | { pathname: Router.RelativePathString; params?: Router.UnknownInputParams }
        | { pathname: Router.ExternalPathString; params?: Router.UnknownInputParams }
        | { pathname: `/exemplo`; params?: Router.UnknownInputParams }
        | { pathname: `/`; params?: Router.UnknownInputParams }
        | { pathname: `/preview-passenger-list`; params?: Router.UnknownInputParams }
        | { pathname: `/_sitemap`; params?: Router.UnknownInputParams }
        | {
            pathname: `${'/(auth)'}/forgot-password-screen` | `/forgot-password-screen`;
            params?: Router.UnknownInputParams;
          }
        | { pathname: `${'/(auth)'}/login` | `/login`; params?: Router.UnknownInputParams }
        | {
            pathname: `${'/(auth)'}/offline-screen` | `/offline-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${'/(auth)'}/onboarding` | `/onboarding`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${'/(auth)'}/register-success` | `/register-success`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${'/(auth)'}/reset-password-screen` | `/reset-password-screen`;
            params?: Router.UnknownInputParams;
          }
        | { pathname: `${'/(auth)'}/splash` | `/splash`; params?: Router.UnknownInputParams }
        | {
            pathname: `${'/(driver)'}/driver-home` | `/driver-home`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${'/(driver)'}/profile-driver-screen` | `/profile-driver-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${'/(driver)'}/vehicle-details-screen` | `/vehicle-details-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${'/(driver)'}${'/(route)'}/active-route-details-screen`
              | `/active-route-details-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${'/(driver)'}${'/(route)'}/active-route-screen` | `/active-route-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${'/(driver)'}${'/(route)'}/create-route-destination-screen`
              | `/create-route-destination-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${'/(driver)'}${'/(route)'}/create-route-info-screen`
              | `/create-route-info-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${'/(driver)'}${'/(route)'}/create-route-origin-screen`
              | `/create-route-origin-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${'/(driver)'}${'/(route)'}/edit-route-screen` | `/edit-route-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${'/(driver)'}${'/(route)'}/enter-route-code-screen`
              | `/enter-route-code-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${'/(driver)'}${'/(route)'}/route-details-screen` | `/route-details-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${'/(driver)'}${'/(route)'}/route-invite-code-screen`
              | `/route-invite-code-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${'/(driver)'}${'/(route)'}/route-passengers-screen`
              | `/route-passengers-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${'/(driver)'}${'/(route)'}/schedule` | `/schedule`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${'/(driver)'}${'/(route)'}/trip-metrics-screen` | `/trip-metrics-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${'/(driver)'}${'/(route)'}/trip-reports-screen` | `/trip-reports-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${'/(passenger)'}/dependent-details-screen` | `/dependent-details-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${'/(passenger)'}/enter-route-code-screen` | `/enter-route-code-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${'/(passenger)'}/participant-selection-screen`
              | `/participant-selection-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${'/(passenger)'}/passenger-active-route-details-screen`
              | `/passenger-active-route-details-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${'/(passenger)'}/passenger-active-route-screen`
              | `/passenger-active-route-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${'/(passenger)'}/passenger-address-screen` | `/passenger-address-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${'/(passenger)'}/passenger-home-screen` | `/passenger-home-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${'/(passenger)'}/passenger-route-details-screen`
              | `/passenger-route-details-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${'/(passenger)'}/profile-passenger-screen` | `/profile-passenger-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${'/(shared)'}/edit-profile-screen` | `/edit-profile-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${'/(shared)'}/register-basic-info-screen` | `/register-basic-info-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${'/(shared)'}/register-driver-details-screen`
              | `/register-driver-details-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${'/(shared)'}/register-passenger-details` | `/register-passenger-details`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname:
              | `${'/(shared)'}/register-profile-selection-screen`
              | `/register-profile-selection-screen`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${'/(shared)'}/user-settings-screen` | `/user-settings-screen`;
            params?: Router.UnknownInputParams;
          };
    }
  }
}
