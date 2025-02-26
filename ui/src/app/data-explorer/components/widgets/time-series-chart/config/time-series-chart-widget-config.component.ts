/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { Component, OnInit } from '@angular/core';
import { BaseWidgetConfig } from '../../base/base-widget-config';
import { TimeSeriesChartVisConfig, TimeSeriesChartWidgetModel } from '../model/time-series-chart-widget.model';
import { WidgetConfigurationService } from '../../../../services/widget-configuration.service';
import { DataExplorerField, EventPropertyUnion } from '@streampipes/platform-services';
import { DataExplorerFieldProviderService } from '../../../../services/data-explorer-field-provider-service';
import { WidgetType } from '../../../../registry/data-explorer-widgets';

@Component({
  selector: 'sp-data-explorer-time-series-chart-widget-config',
  templateUrl: './time-series-chart-widget-config.component.html',
  styleUrls: ['./time-series-chart-widget-config.component.scss']
})
export class TimeSeriesChartWidgetConfigComponent
       extends BaseWidgetConfig<TimeSeriesChartWidgetModel, TimeSeriesChartVisConfig> implements OnInit {

  constructor(widgetConfigurationService: WidgetConfigurationService,
              fieldService: DataExplorerFieldProviderService) {
    super(widgetConfigurationService, fieldService);
  }

  presetColors: string[] = ['#39B54A', '#1B1464', '#f44336', '#4CAF50', '#FFEB3B', '#FFFFFF', '#000000'];

  ngOnInit(): void {
    super.onInit();
  }

  setSelectedProperties(selectedColumns: DataExplorerField[]) {
    this.currentlyConfiguredWidget.visualizationConfig.selectedTimeSeriesChartProperties = selectedColumns;
    // this.currentlyConfiguredWidget.dataConfig.yKeys = this.getRuntimeNames(selectedColumns);
    this.triggerDataRefresh();
  }

  setShowSpikeProperty(field: DataExplorerField) {
    this.currentlyConfiguredWidget.visualizationConfig.showSpike = field['checked'];
    this.triggerDataRefresh();
  }

  setSelectedBackgroundColorProperty(selectedBackgroundColorProperty: EventPropertyUnion) {
    if (selectedBackgroundColorProperty.runtimeName === '') {
      this.currentlyConfiguredWidget.visualizationConfig.selectedBackgroundColorProperty = undefined;
      this.currentlyConfiguredWidget.visualizationConfig.backgroundColorPropertyKey = undefined;
    } else {
      this.currentlyConfiguredWidget.visualizationConfig.selectedBackgroundColorProperty = selectedBackgroundColorProperty;
      this.currentlyConfiguredWidget.visualizationConfig.backgroundColorPropertyKey = selectedBackgroundColorProperty.runtimeName;
    }
    this.triggerDataRefresh();
  }

  toggleLabelingMode() {
    // this.triggerViewRefresh();
  }

  protected getWidgetType(): WidgetType {
    return WidgetType.LineChart;
  }

  protected initWidgetConfig(): TimeSeriesChartVisConfig {
    const numericPlusBooleanFields = this.fieldProvider.numericFields.concat(this.fieldProvider.booleanFields);

    const colors = {};
    const names = {};
    const dTypes = {};
    const axes = {};

    numericPlusBooleanFields.map((field, index) => {
      colors[field.fullDbName + field.sourceIndex] = this.presetColors[index];
      names[field.fullDbName + field.sourceIndex] = field.fullDbName;
      dTypes[field.fullDbName  + field.sourceIndex] = 'lines';
      axes[field.fullDbName  + field.sourceIndex] = 'left';
    });

    return {
      forType: this.getWidgetType(),
      yKeys: [],
      selectedTimeSeriesChartProperties: numericPlusBooleanFields.length > 6 ?
      numericPlusBooleanFields.slice(0, 5) :
      numericPlusBooleanFields,
      chosenColor: colors,
      displayName: names,
      displayType: dTypes,
      chosenAxis: axes,
      showSpike: true,
    };
  }

}
