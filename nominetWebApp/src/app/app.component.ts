import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'nominetWebApp';

  reviewBannerHtml = new URLSearchParams(window.location.search).get('banner') || '';

  showReviewBanner(): void {
    const banner = document.getElementById('review-banner');

    if (banner) {
      banner.innerHTML = this.reviewBannerHtml;
    }
  }
}
